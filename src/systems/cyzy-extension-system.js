import { loadModel } from "../components/gltf-model-plus";
import { getSceneUrlForHub } from "../hub"; //
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
    //mock Data
    this.cyzy_extension_bots["bot1"] = {
      id: "bot1",
      r: 3,
      position: new THREE.Vector3()
    };
  },
  getCustomUserData: function (modelData) {
    // console.log(modelData);
    if (modelData.userData && Object.keys(modelData.userData).length > 0) {
      console.log(modelData);
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
  }
});
