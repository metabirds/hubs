import { Validator } from "jsonschema";
import merge from "deepmerge";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { qsGet } from "../utils/qs_truthy.js";
import detectMobile, { isAndroid, isMobileVR } from "../utils/is-mobile";

const LOCAL_STORE_KEY = "___hubs_store";
const STORE_STATE_CACHE_KEY = Symbol();
const OAUTH_FLOW_CREDENTIALS_KEY = "ret-oauth-flow-account-credentials";
const validator = new Validator();
import { EventTarget } from "event-target-shim";
import { fetchRandomDefaultAvatarId, generateRandomName } from "../utils/identity.js";
import { NO_DEVICE_ID } from "../utils/media-devices-utils.js";
import { AAModes } from "../constants";

const defaultMaterialQuality = (function () {
  const MATERIAL_QUALITY_OPTIONS = ["low", "medium", "high"];

  // HACK: AFRAME is not available on all pages, so we catch the ReferenceError.
  // We could move AFRAME's device utils into a separate package (or into this repo)
  // if we wanted to use these checks without having to import all of AFRAME.

  const cyzyCheckIsMobile = function () {
    //cyzy space

    let _isMobile = false;

    const isIOS = /iPad|iPhone|iPod/.test(window.navigator.platform);
    const isTablet = function () {
      const userAgent = window.navigator.userAgent;
      return /ipad|Nexus (7|9)|xoom|sch-i800|playbook|tablet|kindle/i.test(userAgent);
    };
    const isIPad = function () {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return userAgent.indexOf("ipad") > -1 || (userAgent.indexOf("macintosh") > -1 && "ontouchend" in document);
    };
    const isR7 = /R7 Build/.test(window.navigator.userAgent);
    const isMobileVR = function () {
      const isFirefoxReality = /(Mobile VR)/i.test(window.navigator.userAgent);
      const isOculusBrowser = /(OculusBrowser)/i.test(window.navigator.userAgent);
      return isOculusBrowser || isFirefoxReality;
    };
    (function (a) {
      // eslint-disable-next-line no-useless-escape
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      ) {
        _isMobile = true;
      }
      if (isIOS || isTablet() || isIPad() || isR7 || isMobileVR()) {
        _isMobile = true;
      }
    })(window.navigator.userAgent || window.navigator.vendor || window.opera);

    return _isMobile;
  };
  const isMobile =
    (window.AFRAME && (AFRAME.utils.device.isMobile() || AFRAME.utils.device.isMobileVR())) || cyzyCheckIsMobile();

  if (isMobile) {
    const qsMobileDefault = qsGet("default_mobile_material_quality");
    if (qsMobileDefault && MATERIAL_QUALITY_OPTIONS.indexOf(qsMobileDefault) !== -1) {
      return qsMobileDefault;
    }
    return "low";
  }

  const qsDefault = qsGet("default_material_quality");
  if (qsDefault && MATERIAL_QUALITY_OPTIONS.indexOf(qsDefault) !== -1) {
    return qsDefault;
  }

  return "high";
})();

// WebAudio on Android devices (only non-VR devices?) seems to have
// a bug and audio can be broken if there are many people in a room.
// We have reported the problem to the Android devs. We found that
// using equal power panning mode can mitigate the problem so we
// use low audio panning quality (= equal power mode) by default
// on Android as workaround until the root issue is fixed on
// Android end. See
//   - https://github.com/mozilla/hubs/issues/5057
//   - https://bugs.chromium.org/p/chromium/issues/detail?id=1308962
const defaultAudioPanningQuality = () => {
  return isAndroid() && !isMobileVR() ? "Low" : "High";
};

//workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1626081 : disable echoCancellation, noiseSuppression, autoGainControl
const isFirefoxReality = window.AFRAME?.utils.device.isMobileVR() && navigator.userAgent.match(/Firefox/);

// Durable (via local-storage) schema-enforced state that is meant to be consumed via forward data flow.
// (Think flux but with way less incidental complexity, at least for now :))
export const SCHEMA = {
  id: "/HubsStore",

  definitions: {
    profile: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayName: {
          type: "string",
          pattern:
            "^[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー～　（）［］【】０-９A-Za-z0-9_~ -]{3,32}$"
        },
        avatarId: { type: "string" },
        // personalAvatarId is obsolete, but we need it here for backwards compatibility.
        personalAvatarId: { type: "string" }
      }
    },

    credentials: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: ["null", "string"] },
        email: { type: ["null", "string"] }
      }
    },

    activity: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasFoundFreeze: { type: "boolean" },
        hasChangedName: { type: "boolean" },
        hasAcceptedProfile: { type: "boolean" },
        lastEnteredAt: { type: "string" },
        hasPinned: { type: "boolean" },
        hasRotated: { type: "boolean" },
        hasRecentered: { type: "boolean" },
        hasScaled: { type: "boolean" },
        hasHoveredInWorldHud: { type: "boolean" },
        hasOpenedShare: { type: "boolean" },
        entryCount: { type: "number" }
      }
    },

    settings: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastUsedMicDeviceId: { type: "string" },
        micMuted: { type: "bool" }
      }
    },

    preferences: {
      type: "object",
      additionalProperties: false,
      properties: {
        shouldPromptForRefresh: { type: "bool", default: false },
        // Preferred media will be set dynamically
        preferredMic: { type: "string", default: NO_DEVICE_ID },
        preferredSpeakers: { type: "string", default: NO_DEVICE_ID },
        preferredCamera: { type: "string", default: NO_DEVICE_ID },
        muteMicOnEntry: { type: "bool", default: false },
        disableLeftRightPanning: { type: "bool", default: false },
        audioNormalization: { type: "bool", default: 0.0 },
        invertTouchscreenCameraMove: { type: "bool", default: true },
        enableOnScreenJoystickLeft: { type: "bool", default: detectMobile() },
        enableOnScreenJoystickRight: { type: "bool", default: detectMobile() },
        enableGyro: { type: "bool", default: true },
        animateWaypointTransitions: { type: "bool", default: true },
        showFPSCounter: { type: "bool", default: false },
        allowMultipleHubsInstances: { type: "bool", default: false },
        disableIdleDetection: { type: "bool", default: false },
        fastRoomSwitching: { type: "bool", default: false },
        lazyLoadSceneMedia: { type: "bool", default: false },
        preferMobileObjectInfoPanel: { type: "bool", default: false },
        // if unset, maxResolution = screen resolution
        maxResolutionWidth: { type: "number", default: undefined },
        maxResolutionHeight: { type: "number", default: undefined },
        globalVoiceVolume: { type: "number", default: 100 },
        globalMediaVolume: { type: "number", default: 100 },
        globalSFXVolume: { type: "number", default: 100 },
        snapRotationDegrees: { type: "number", default: 45 },
        materialQualitySetting: { type: "string", default: defaultMaterialQuality },
        enableDynamicShadows: { type: "bool", default: false },
        disableSoundEffects: { type: "bool", default: false },
        disableMovement: { type: "bool", default: false },
        disableBackwardsMovement: { type: "bool", default: false },
        disableStrafing: { type: "bool", default: false },
        disableTeleporter: { type: "bool", default: false },
        disableAutoPixelRatio: { type: "bool", default: false },
        movementSpeedModifier: { type: "number", default: 1 },
        disableEchoCancellation: { type: "bool", default: isFirefoxReality },
        disableNoiseSuppression: { type: "bool", default: isFirefoxReality },
        disableAutoGainControl: { type: "bool", default: isFirefoxReality },
        locale: { type: "string", default: "browser" },
        showRtcDebugPanel: { type: "bool", default: false },
        showAudioDebugPanel: { type: "bool", default: false },
        enableAudioClipping: { type: "bool", default: false },
        audioClippingThreshold: { type: "number", default: 0.015 },
        audioPanningQuality: { type: "string", default: defaultAudioPanningQuality() },
        theme: { type: "string", default: undefined },
        cursorSize: { type: "number", default: 1 },
        nametagVisibility: { type: "string", default: "showAll" },
        nametagVisibilityDistance: { type: "number", default: 5 },
        avatarVoiceLevels: { type: "object" },
        enablePostEffects: { type: "bool", default: false },
        enableBloom: { type: "bool", default: true }, // only applies if post effects are enabled
        aaMode: { type: "string", default: AAModes.MSAA_4X } // only applies if post effects are enabled
      }
    },

    // Legacy
    confirmedDiscordRooms: {
      type: "array",
      items: { type: "string" }
    },

    confirmedBroadcastedRooms: {
      type: "array",
      items: { type: "string" }
    },

    uploadPromotionTokens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          fileId: { type: "string" },
          promotionToken: { type: "string" }
        }
      }
    },

    creatorAssignmentTokens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          hubId: { type: "string" },
          creatorAssignmentToken: { type: "string" }
        }
      }
    },

    embedTokens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          hubId: { type: "string" },
          embedToken: { type: "string" }
        }
      }
    },

    onLoadActions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string" },
          args: { type: "object" }
        }
      }
    }
  },

  type: "object",

  properties: {
    profile: { $ref: "#/definitions/profile" },
    credentials: { $ref: "#/definitions/credentials" },
    activity: { $ref: "#/definitions/activity" },
    settings: { $ref: "#/definitions/settings" },
    preferences: { $ref: "#/definitions/preferences" },
    confirmedDiscordRooms: { $ref: "#/definitions/confirmedDiscordRooms" }, // Legacy
    confirmedBroadcastedRooms: { $ref: "#/definitions/confirmedBroadcastedRooms" },
    uploadPromotionTokens: { $ref: "#/definitions/uploadPromotionTokens" },
    creatorAssignmentTokens: { $ref: "#/definitions/creatorAssignmentTokens" },
    embedTokens: { $ref: "#/definitions/embedTokens" },
    onLoadActions: { $ref: "#/definitions/onLoadActions" }
  },

  additionalProperties: false
};

export default class Store extends EventTarget {
  constructor() {
    super();

    this._preferences = {};

    if (localStorage.getItem(LOCAL_STORE_KEY) === null) {
      localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify({}));
    }

    // When storage is updated in another window
    window.addEventListener("storage", e => {
      if (e.key !== LOCAL_STORE_KEY) return;
      delete this[STORE_STATE_CACHE_KEY];
      this.dispatchEvent(new CustomEvent("statechanged"));
    });

    this.update({
      activity: {},
      settings: {},
      credentials: {},
      profile: {},
      confirmedDiscordRooms: [],
      confirmedBroadcastedRooms: [],
      uploadPromotionTokens: [],
      creatorAssignmentTokens: [],
      embedTokens: [],
      onLoadActions: [],
      preferences: {}
    });

    this._shouldResetAvatarOnInit = false;

    const oauthFlowCredentials = Cookies.getJSON(OAUTH_FLOW_CREDENTIALS_KEY);
    if (oauthFlowCredentials) {
      this.update({ credentials: oauthFlowCredentials });
      this._shouldResetAvatarOnInit = true;
      Cookies.remove(OAUTH_FLOW_CREDENTIALS_KEY);
    }

    this._signOutOnExpiredAuthToken();

    const maybeDispatchThemeChanged = (() => {
      let previous;
      return () => {
        const current = this.state.preferences.theme;
        if ((previous || current) && previous !== current) {
          this.dispatchEvent(new CustomEvent("themechanged", { detail: { current, previous } }));
        }
        previous = current;
      };
    })();
    this.addEventListener("statechanged", maybeDispatchThemeChanged);
  }

  _signOutOnExpiredAuthToken = () => {
    if (!this.state.credentials.token) return;

    const expiry = jwtDecode(this.state.credentials.token).exp * 1000;
    if (expiry <= Date.now()) {
      this.update({ credentials: { token: null, email: null } });
    }
  };

  initProfile = async () => {
    if (this._shouldResetAvatarOnInit) {
      await this.resetToRandomDefaultAvatar();
    } else {
      this.update({
        profile: { avatarId: await fetchRandomDefaultAvatarId(), ...(this.state.profile || {}) }
      });
    }

    // Regenerate name to encourage users to change it.
    if (!this.state.activity.hasChangedName) {
      this.update({ profile: { displayName: generateRandomName() } });
    }
  };

  resetToRandomDefaultAvatar = async () => {
    this.update({
      profile: { ...(this.state.profile || {}), avatarId: await fetchRandomDefaultAvatarId() }
    });
  };

  get state() {
    if (!Object.prototype.hasOwnProperty.call(this, STORE_STATE_CACHE_KEY)) {
      const state = (this[STORE_STATE_CACHE_KEY] = JSON.parse(localStorage.getItem(LOCAL_STORE_KEY)));
      if (!state.preferences) state.preferences = {};
      this._preferences = { ...state.preferences }; // cache prefs without injected defaults
      // inject default values
      for (const [key, props] of Object.entries(SCHEMA.definitions.preferences.properties)) {
        if (!Object.prototype.hasOwnProperty.call(props, "default")) continue;
        if (!Object.prototype.hasOwnProperty.call(state.preferences, key)) {
          state.preferences[key] = props.default;
        } else if (state.preferences[key] === props.default) {
          delete this._preferences[key];
        }
      }
    }

    return this[STORE_STATE_CACHE_KEY];
  }

  get credentialsAccountId() {
    if (this.state.credentials.token) {
      return jwtDecode(this.state.credentials.token).sub;
    } else {
      return null;
    }
  }

  resetConfirmedBroadcastedRooms() {
    this.clearStoredArray("confirmedBroadcastedRooms");
  }

  resetTipActivityFlags() {
    this.update({
      activity: { hasRotated: false, hasPinned: false, hasRecentered: false, hasScaled: false, entryCount: 0 }
    });
  }

  bumpEntryCount() {
    const currentEntryCount = this.state.activity.entryCount || 0;
    this.update({ activity: { entryCount: currentEntryCount + 1 } });
  }

  // Sets a one-time action to perform the next time the page loads
  enqueueOnLoadAction(action, args) {
    this.update({ onLoadActions: [{ action, args }] });
  }

  executeOnLoadActions(sceneEl) {
    for (let i = 0; i < this.state.onLoadActions.length; i++) {
      const { action, args } = this.state.onLoadActions[i];

      if (action === "emit_scene_event") {
        sceneEl.emit(args.event, args.detail);
      }
    }

    this.clearOnLoadActions();
  }

  clearOnLoadActions() {
    this.clearStoredArray("onLoadActions");
  }

  clearStoredArray(key) {
    const overwriteMerge = (destinationArray, sourceArray) => sourceArray;
    const update = {};
    update[key] = [];

    this.update(update, { arrayMerge: overwriteMerge });
  }

  update(newState, mergeOpts) {
    const finalState = merge({ ...this.state, preferences: this._preferences }, newState, mergeOpts);
    const { valid, errors } = validator.validate(finalState, SCHEMA);

    // Cleanup unsupported properties
    if (!valid) {
      errors.forEach(error => {
        // Ignore jsonschema error for displayName, as jsonschema validator don't enable 'unicode'
        // flag for RegExp constructor before 1.2.9.
        if (error.property === "instance.profile.displayName") return;

        console.error(`Removing invalid preference from store: ${error.message}`);
        delete error.instance[error.argument];
      });
    }

    if (newState.preferences) {
      // clear preference if equal to default value so that, when client is updated with different defaults,
      // new defaults will apply without user action
      for (const [key, value] of Object.entries(finalState.preferences)) {
        if (
          SCHEMA.definitions.preferences.properties[key] &&
          Object.prototype.hasOwnProperty.call(SCHEMA.definitions.preferences.properties[key], "default") &&
          value === SCHEMA.definitions.preferences.properties[key].default
        ) {
          delete finalState.preferences[key];
        }
      }
      this._preferences = finalState.preferences;
    }

    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(finalState));
    delete this[STORE_STATE_CACHE_KEY];

    if (newState.profile !== undefined) {
      this.dispatchEvent(new CustomEvent("profilechanged"));
    }
    this.dispatchEvent(new CustomEvent("statechanged"));

    return finalState;
  }

  getEmbedTokenForHub(hub) {
    const embedTokenEntry = this.state.embedTokens.find(embedTokenEntry => embedTokenEntry.hubId === hub.hub_id);
    if (embedTokenEntry) {
      return embedTokenEntry.embedToken;
    } else {
      return null;
    }
  }

  get schema() {
    return SCHEMA;
  }
}
