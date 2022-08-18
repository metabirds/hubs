import { isLocalHubsUrl, isLocalHubsSceneUrl, isHubsRoomUrl, isLocalHubsAvatarUrl } from "../utils/media-url-utils";
import { guessContentType } from "../utils/media-url-utils";
import { handleExitTo2DInterstitial } from "../utils/vr-interstitial";
import { changeHub } from "../change-hub";

AFRAME.registerComponent("open-media-button", {
  schema: {
    onlyOpenLink: { type: "boolean" }
  },
  init() {
    this.label = this.el.querySelector("[text]");

    this.updateSrc = async () => {
      if (!this.targetEl.parentNode) return; // If removed
      const mediaLoader = this.targetEl.components["media-loader"].data;
      let src = (this.src = (mediaLoader.mediaOptions && mediaLoader.mediaOptions.href) || mediaLoader.src); // cyzyspace
      const visible = src && guessContentType(src) !== "video/vnd.hubs-webrtc";
      const mayChangeScene = this.el.sceneEl.systems.permissions.canOrWillIfCreator("update_hub");

      this.el.object3D.visible = !!visible;

      // cyzyspace
      if (src && src.match("__ROOM_ID__")) {
        const roomId = window.location.pathname.split("/")[1];
        const replacedHref = src.replace("__ROOM_ID__", roomId);

        const validationUrl = new URL(replacedHref);
        const searchParams = validationUrl.searchParams;
        searchParams.append("validate", "1");
        validationUrl.search = searchParams.toString();

        fetch(validationUrl.toString(), { method: "GET" })
          .then(v => {
            if (v.status === 200) {
              console.log("200");
              src = this.src = replacedHref;
            } else {
              console.log("head response - error:", v.status);
              src = this.src = mediaLoader.src;
            }
          })
          .catch(() => {
            console.log("head request - failed:", replacedHref);
          });
      }

      if (visible) {
        let label = "open link";
        if (!this.data.onlyOpenLink) {
          let hubId;
          if (await isLocalHubsAvatarUrl(src)) {
            label = "use avatar";
          } else if ((await isLocalHubsSceneUrl(src)) && mayChangeScene) {
            label = "use scene";
          } else if ((hubId = await isHubsRoomUrl(src))) {
            const url = new URL(src);
            if (url.hash && window.APP.hub.hub_id === hubId) {
              label = "go to";
            } else {
              label = "visit room";
            }
          }
        }
        this.label.setAttribute("text", "value", label);
      }
    };

    this.onClick = async () => {
      const mayChangeScene = this.el.sceneEl.systems.permissions.canOrWillIfCreator("update_hub");

      const exitImmersive = async () => await handleExitTo2DInterstitial(false, () => {}, true);

      let hubId;
      if (this.data.onlyOpenLink) {
        await exitImmersive();
        // cyzyspace
        const href = this.src;
        if (href.match("__ROOM_ID__")) {
          const roomId = window.location.pathname.split("/")[1];
          const replacedHref = href.replace("__ROOM_ID__", roomId);
          window.open(replacedHref);
        } else {
          window.open(this.src);
        }
      } else if (await isLocalHubsAvatarUrl(this.src)) {
        const avatarId = new URL(this.src).pathname.split("/").pop();
        window.APP.store.update({ profile: { avatarId } });
        this.el.sceneEl.emit("avatar_updated");
      } else if ((await isLocalHubsSceneUrl(this.src)) && mayChangeScene) {
        this.el.sceneEl.emit("scene_media_selected", this.src);
      } else if ((hubId = await isHubsRoomUrl(this.src))) {
        const url = new URL(this.src);
        if (url.hash && window.APP.hub.hub_id === hubId) {
          // move to waypoint w/o writing to history
          window.history.replaceState(null, null, window.location.href.split("#")[0] + url.hash);
        } else if (APP.store.state.preferences.fastRoomSwitching && isLocalHubsUrl(this.src)) {
          // move to new room without page load or entry flow
          changeHub(hubId);
        } else {
          await exitImmersive();
          location.href = this.src;
        }
      } else {
        // cyzyspace
        if (this.src.slice(0, 1) === "#") {
          window.location = this.src;
        } else {
          await exitImmersive();
          window.open(this.src);
        }
      }
    };

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;
      this.targetEl.addEventListener("media_resolved", this.updateSrc, { once: true });
      this.updateSrc();
    });
  },

  play() {
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("interact", this.onClick);
  }
});
