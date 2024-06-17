// cyzyspace : for searching scripts
import { loadModel } from "../components/gltf-model-plus";
import { getSceneUrlForHub } from "../hub"; //
import { addMedia } from "../utils/media-utils";
import { ObjectContentOrigins } from "../object-types";
AFRAME.registerSystem("cyzy-extension", {
  init: function () {
    this.tickCount = 0;
    this.playerRig = null;
    this.prevPos = new THREE.Vector3();
    this.currentPos = new THREE.Vector3();
    this.scene = document.querySelector("a-scene");
    this.enterSceneFlg = false;
    this.cyzy_extension_bots = {};
    this.botList = [];
    this.prevBotList = [];
    // listener
    // this.el.sceneEl.addEventListener("loaded", () => {
    //   this.checkGltfUserData();
    // });
  },
  tick() {
    if (!this.enterSceneFlg && this.scene.is("entered")) {
      console.log("entered");
      this.createListener();
      // //
      // // Add a button to the HTML
      // const button = document.createElement("button");
      // button.innerText = "Toggle Visibility";
      // button.style.position = "absolute";
      // button.style.top = "10px";
      // button.style.right = "10px";
      // document.body.appendChild(button);
      // let testDev = true;
      // // Add an event listener to the button to toggle visibility
      // button.addEventListener("click", () => {
      //   const event = new CustomEvent("cyzy_anim_object", {
      //     detail: {
      //       id: "botDev",
      //       enable: testDev
      //     }
      //   });
      //   window.dispatchEvent(event);
      //   testDev = !testDev;
      // });
      // //
      this.checkGltfUserData();
      this.enterSceneFlg = true;
    }
    if (this.playerRig) {
      this.playerRig.object3D.getWorldPosition(this.currentPos);
      // console.log(`${this.prevPos.x} : ${this.currentPos.x} : ${this.prevPos.equals(this.currentPos)}`);
      if (!this.prevPos.equals(this.currentPos)) {
        this.prevPos.copy(this.currentPos);
        //bot detect
        // console.log(this.currentPos);
        if (Object.keys(this.cyzy_extension_bots).length !== 0) {
          this.botAreaChecker();
          this.cyzyChatPopover();
        }
      } else {
        //same position do nothing
        // console.log("samePos");
      }
    } else {
      this.playerRig = document.getElementById("avatar-rig");
    }
  },
  checkGltfUserData: async function () {
    const sceneUrl = await getSceneUrlForHub(APP.hub);
    console.log(sceneUrl);
    // const objectsUrl = getReticulumFetchUrl(`/${APP.hubChannel.hubId}/objects.gltf`);
    const gltfScene = await loadModel(sceneUrl, null, false, null);
    // const gltfScene = cloneModelFromCache(sceneUrl);
    // console.log(gltfScene);
    this.getCustomUserData(gltfScene.scene);
  },
  getCustomUserData: function (modelData) {
    // console.log(modelData);
    if (modelData.userData && Object.keys(modelData.userData).length > 0) {
      // console.log(modelData);
      if (modelData.userData?.cyzy_bot_area) {
        const botData = JSON.parse(modelData.userData.cyzy_bot_area);
        console.log("Parsed bot area data:", botData);
        this.cyzy_extension_bots[botData.id] = {
          id: botData.id,
          r: botData.r,
          position: modelData.position
        };
        console.log("CurrentBotData:", this.cyzy_extension_bots);
      }
    }
    //restrict search
    if (modelData.children && modelData.children.length > 0) {
      modelData.children.forEach(child => {
        this.getCustomUserData(child);
      });
    }
  },
  botAreaChecker: function () {
    Object.keys(this.cyzy_extension_bots).forEach(id => {
      const bot = this.cyzy_extension_bots[id];
      const distance = this.currentPos.distanceTo(bot.position);
      if (distance <= bot.r) {
        // console.log(`Player is within area ID: ${id}`);
        if (!this.botList.includes(id)) {
          this.botList.push(id);
        }
      } else {
        // console.log(`Player is out range`);
        const index = this.botList.indexOf(id);
        if (this.botList.indexOf(id) > -1) {
          this.botList.splice(index, 1);
        }
      }
    });
  },
  cyzyChatPopover: function () {
    if (!this.arraysAreEqualIgnoreOrder(this.botList, this.prevBotList)) {
      const enableBotList = this.getAddedElements(this.botList, this.prevBotList);
      const disableBotList = this.getAddedElements(this.prevBotList, this.botList);
      // Enable bots
      enableBotList.forEach(id => {
        console.log(`enable:${id}`);
        window.postMessage({ cyzyBot: "enable", cyzyBotId: id }, "*");
      });
      // Disable bots
      disableBotList.forEach(id => {
        console.log(`disable:${id}`);
        window.postMessage({ cyzyBot: "disable", cyzyBotId: id }, "*");
      });
      // update prev list
      this.prevBotList = this.botList.slice();
    }
  },
  arraysAreEqualIgnoreOrder: function (arr1, arr2) {
    const sortedArr1 = (arr1 || []).slice().sort();
    const sortedArr2 = (arr2 || []).slice().sort();
    return (
      sortedArr1.length === sortedArr2.length && sortedArr1.every((element, index) => element === sortedArr2[index])
    );
  },
  getAddedElements: function (arr1, arr2) {
    return (arr1 || []).filter(element => !arr2.includes(element));
  },
  createListener: function () {
    window.addEventListener("cyzy_anim_object", event => {
      const animEnable = event.detail.enable ? event.detail.enable : false;
      if (event.detail.id) {
        // console.log("CyzyAnim:", event.detail.id, event.detail.enable);
        const objEl = document.getElementsByClassName(`cyzy-${event.detail.id}-obj`)[0];
        const animEl = document.getElementsByClassName(`cyzy-${event.detail.id}-anim`)[0];
        if (
          objEl &&
          animEl &&
          objEl !== undefined &&
          animEl !== undefined &&
          objEl !== "undefined" &&
          animEl !== "undefined"
        ) {
          objEl.object3D.visible = !animEnable;
          animEl.object3D.visible = animEnable;
        }
      }
    });
    window.addEventListener("cyzy_bot_data", event => {
      const operation = event.detail.operation ? event.detail.operation : null;
      switch (operation) {
        case "add":
          console.log("CyzyBot: ADD");
          if (event.detail.id && event.detail.radius && event.detail.position) {
            this.cyzy_extension_bots[event.detail.id] = {
              id: event.detail.id,
              r: event.detail.radius,
              position: {
                x: event.detail.position.x,
                y: event.detail.position.y,
                z: event.detail.position.z
              }
            };
          }
          break;
        case "remove":
          console.log("CyzyBot: REMOVE");
          delete this.cyzy_extension_bots[event.detail.id];
          break;
        default:
          console.warn("CyzyBot: Invalid Operation");
          break;
      }
    });
  },
  spawnPrivateMedia: function (url) {
    //InPprogress
    // if (!this.hubChannel.can("spawn_and_move_media")) return;

    const offset = { x: 0, y: 0, z: -1.5 };
    // const { entity, orientation } = addMedia(
    //   url,
    //   "#interactable-media",
    //   ObjectContentOrigins.URL,
    //   null,
    //   true,
    //   true,
    //   false,
    //   null,
    //   null
    // );
    const { entity, orientation } = addMedia(url, "#interactable-media", ObjectContentOrigins.URL, null, null, true);
    orientation.then(or => {
      entity.setAttribute("offset-relative-to", {
        target: "#avatar-pov-node",
        offset,
        orientation: or
      });
    });

    return entity;
  }
});
