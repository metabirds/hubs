import { isLocalHubsUrl, isLocalHubsSceneUrl, isHubsRoomUrl, isLocalHubsAvatarUrl } from "../utils/media-url-utils";
import { guessContentType } from "../utils/media-url-utils";
import { handleExitTo2DInterstitial } from "../utils/vr-interstitial";
import { changeHub } from "../change-hub";
import {
  CYZY_ROOM_ID_PLACEHOLDER,
  cyzyAddValidationQuery,
  cyzyGetCurrentRoomId,
  cyzyReplaceRoomUrl
} from "../utils/cyzy-utils";

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
      if (src && src.match(CYZY_ROOM_ID_PLACEHOLDER)) {
        const replacedHref = cyzyReplaceRoomUrl(src, cyzyGetCurrentRoomId());
        const validationUrl = cyzyAddValidationQuery(replacedHref);
        fetch(validationUrl, { method: "GET" })
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
          } else if (window.daisyServerUri && src.match(window.daisyServerUri)) {
            label = "visit room";
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
        if (href.match(CYZY_ROOM_ID_PLACEHOLDER)) {
          const replacedHref = cyzyReplaceRoomUrl(href, cyzyGetCurrentRoomId());
          const srcUrl = new URL(replacedHref);
          const qs = new URLSearchParams(srcUrl.search);
          if (qs.has("popupView")) {
            this.postMessage(replacedHref, "popupView");
          } else {
            window.open(replacedHref);
          }
        } else {
          const srcUrl = new URL(this.src);
          const qs = new URLSearchParams(srcUrl.search);
          if (qs.has("popupView")) {
            this.postMessage(this.src);
          } else {
            window.open(this.src);
          }
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
        } else if (await isLocalHubsUrl(this.src)) {
          const waypoint = url.hash && url.hash.substring(1);
          // move to new room without page load or entry flow
          changeHub(hubId, true, waypoint);
        } else {
          await exitImmersive();
          const srcUrl = new URL(this.src);
          const qs = new URLSearchParams(srcUrl.search);
          if (qs.has("popupView")) {
            this.postMessage(this.src, "popupView");
          } else {
            location.href = this.src;
          }
        }
      } else if (window.daisyServerUri && this.src.match(window.daisyServerUri)) {
        if (window.APP.store.state.profile.cyzyUserToken) {
          const srcUrl = new URL(this.src);
          srcUrl.searchParams.append("cyzyUserToken", window.APP.store.state.profile.cyzyUserToken);
          location.href = srcUrl;
        } else {
          location.href = this.src;
        }
      } else {
        // cyzyspace
        if (this.src.slice(0, 1) === "#") {
          window.location = this.src;
        } else {
          await exitImmersive();
          const urlStr = this.src;
          if (urlStr.match("linkhref-")) {
            const jsonUrl = new URL(this.src);
            const searchParams = jsonUrl.searchParams;
            searchParams.append("noredirect", "1");
            jsonUrl.search = searchParams.toString();
            fetch(jsonUrl.toString(), { method: "GET" })
              .then(v => {
                return v.json();
              })
              .then(v => {
                const srcUrl = new URL(v.url);
                const qs = new URLSearchParams(srcUrl.search);
                if (qs.has("popupView")) {
                  this.postMessage(this.src, "popupView");
                } else {
                  window.open(this.src);
                }
              })
              .catch(() => {
                console.log("head request - failed:", jsonUrl);
              });
          } else {
            const srcUrl = new URL(this.src);
            const qs = new URLSearchParams(srcUrl.search);
            if (qs.has("popupView")) {
              this.postMessage(this.src, "popupView");
            } else {
              window.open(this.src);
            }
          }
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
  },
  postMessage(url, type) {
    // cyzy space
    if (type === "popupView") {
      self.postMessage({
        eventType: "popupView",
        params: { url: url }
      });
    }
    if (type === "moveToDaisy") {
      self.postMessage({
        eventType: "moveToDaisy",
        params: { url: url }
      });
    }
  }
});
