// cyzyspace
import { loadModel } from "../components/gltf-model-plus";
import { getSceneUrlForHub } from "../hub";
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

    this.createListener();
  },
  tick() {
    if (!this.enterSceneFlg && this.scene.is("entered")) {
      this.checkGltfUserData();
      this.enterSceneFlg = true;
    }
    if (this.playerRig) {
      this.playerRig.object3D.getWorldPosition(this.currentPos);
      if (!this.prevPos.equals(this.currentPos)) {
        this.prevPos.copy(this.currentPos);
        if (Object.keys(this.cyzy_extension_bots).length !== 0) {
          this.botAreaChecker();
          this.cyzyChatPopover();
        }
      }
    } else {
      this.playerRig = document.getElementById("avatar-rig");
    }
  },
  checkGltfUserData: async function () {
    const sceneUrl = await getSceneUrlForHub(APP.hub);
    const gltfScene = await loadModel(sceneUrl, null, false, null);
    this.getCustomUserData(gltfScene.scene);
  },
  getCustomUserData: function (modelData) {
    if (modelData.userData && Object.keys(modelData.userData).length > 0) {
      if (modelData.userData?.cyzy_bot_area) {
        const botData = JSON.parse(modelData.userData.cyzy_bot_area);
        console.log("Parsed bot area data:", botData);
        this.cyzy_extension_bots[botData.id] = {
          id: botData.id,
          r: botData.r,
          position: modelData.position
        };
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
        if (!this.botList.includes(id)) {
          this.botList.push(id);
        }
      } else {
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
      enableBotList.forEach(id => {
        window.postMessage({ cyzyBot: "enable", cyzyBotId: id }, "*");
      });
      disableBotList.forEach(id => {
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
          delete this.cyzy_extension_bots[event.detail.id];
          break;
        default:
          console.warn("CyzyBot: Invalid Operation");
          break;
      }
    });
  },
  spawnPrivateMedia: function (url) {
    const offset = { x: 0, y: 0, z: -1.5 };
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
