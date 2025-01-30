/**
 * @name BDNitro
 * @author SrGobi
 * @version 5.6.1
 * @invite cqrN3Eg
 * @source https://github.com/srgobi/BDNitro
 * @donate https://github.com/srgobi/BDNitro?tab=readme-ov-file#donate
 * @updateUrl https://raw.githubusercontent.com/srgobi/BDNitro/main/BDNitro.plugin.js
 * @description Unlock all screensharing modes, and use cross-server & GIF emotes!
 */
/*@cc_on
@if(@_jscript)
	
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if(fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if(!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if(shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

//#region
const { Webpack, Patcher, Net, React, UI, Logger, Data } = BdApi;
const StreamButtons = Webpack.getByKeys('L9', 'LY', 'ND', 'WC', 'aW', 'af');
const ApplicationStreamResolutions = StreamButtons.LY;
const ApplicationStreamSettingRequirements = StreamButtons.ND;
const ApplicationStreamResolutionButtons = StreamButtons.WC;
const ApplicationStreamFPSButtonsWithSuffixLabel = StreamButtons.af;
const ApplicationStreamFPSButtons = StreamButtons.k0;
const ApplicationStreamResolutionButtonsWithSuffixLabel = StreamButtons.km;
const ApplicationStreamFPS = StreamButtons.ws;
const CloudUploader = Webpack.getByKeys('m', 'n').n;
const Uploader = Webpack.getByKeys('uploadFiles', 'upload');
const CurrentUser = Webpack.getByKeys('getCurrentUser').getCurrentUser();
const ORIGINAL_NITRO_STATUS = CurrentUser.premiumType;
const getBannerURL = Webpack.getByPrototypeKeys('getBannerURL').prototype;
let usrBgUsers = [];
let badgeUserIDs = [];
let fetchedUserBg = false;
let fetchedUserPfp = false;
let downloadedUserProfiles = [];
const userProfileMod = Webpack.getByKeys('getUserProfile');
const buttonClassModule = Webpack.getByKeys('lookFilled', 'button', 'contents');
const Dispatcher = Webpack.getByKeys('subscribe', 'dispatch');
const canUserUseMod = Webpack.getByKeys('$0', 'ks');
const AvatarDefaults = Webpack.getByKeys('getEmojiURL');
const LadderModule = Webpack.getModule(Webpack.Filters.byProps('calculateLadder'), { searchExports: true });
const FetchCollectibleCategories = Webpack.getByKeys('B1', 'DR', 'F$', 'K$').F$;
let ffmpeg = undefined;
const MP4Box = Webpack.getByKeys('MP4BoxStream');
const udta = new Uint8Array([
	0, 0, 0, 89, 109, 101, 116, 97, 0, 0, 0, 0, 0, 0, 0, 33, 104, 100, 108, 114, 0, 0, 0, 0, 0, 0, 0, 0, 109, 100, 105, 114, 97, 112, 112, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 105, 108, 115, 116, 0, 0, 0, 36, 169, 116, 111, 111, 0, 0, 0, 28, 100, 97, 116, 97, 0, 0, 0, 1, 0, 0, 0, 0, 76, 97, 118, 102, 54, 49, 46, 51, 46, 49, 48, 51, 0, 0, 46, 46, 117, 117, 105, 100, 161, 200, 82, 153, 51, 70, 77, 184, 136, 240,
	131, 245, 122, 117, 165, 239
]);
const udtaBuffer = udta.buffer;
const UserStatusStore = Webpack.getByKeys('getStatus', 'getState');
const SelectedGuildStore = Webpack.getStore('SelectedGuildStore');
const ChannelStore = Webpack.getStore('ChannelStore');
const MessageActions = Webpack.getByKeys('jumpToMessage', '_sendMessage');
const SelectedChannelStore = Webpack.getStore('SelectedChannelStore');
const UserStore = Webpack.getStore('UserStore');
const AccountDetailsClasses = Webpack.getByKeys('container', 'avatar', 'hasBuildOverride');
//#endregion

const defaultSettings = {
	certified_moderator: false,
	hypesquad: false,
	hypesquad_house_1: false,
	hypesquad_house_2: false,
	hypesquad_house_3: false,
	bug_hunter_level_1: false,
	verified_developer: false,
	NITRO: false,
	early_supporter: false,
	emojiSize: 64,
	screenSharing: true,
	emojiBypass: true,
	emojiBypassType: 0,
	emojiBypassForValidEmoji: true,
	PNGemote: true,
	uploadStickers: false,
	CustomFPSEnabled: false,
	CustomFPS: 60,
	ResolutionEnabled: false,
	CustomResolution: 1440,
	CustomBitrateEnabled: false,
	minBitrate: -1,
	maxBitrate: -1,
	targetBitrate: -1,
	voiceBitrate: -1,
	ResolutionSwapper: false,
	stickerBypass: false,
	profileV2: false,
	forceStickersUnlocked: false,
	changePremiumType: false,
	// "videoCodec": 0,
	clientThemes: true,
	lastGradientSettingStore: -1,
	fakeProfileThemes: true,
	removeProfileUpsell: false,
	removeScreenshareUpsell: true,
	fakeProfileBanners: true,
	fakeAvatarDecorations: true,
	unlockAppIcons: false,
	profileEffects: true,
	killProfileEffects: false,
	avatarDecorations: {},
	customPFPs: true,
	experiments: false,
	userPfpIntegration: true,
	userBgIntegration: true,
	useClipBypass: true,
	alwaysTransmuxClips: false,
	forceClip: false,
	checkForUpdates: true
};

let settings = Object.assign({}, defaultSettings, Data.load('BDNitro', 'settings'));

const config = {
	info: {
		name: 'BDNitro',
		authors: [
			{
				name: 'SrGobi',
				discord_id: '360881334647914506',
				github_username: 'srgobi'
			}
		],
		version: '5.6.1',
		description: 'Unlock all screensharing modes, and use cross-server & GIF emotes!',
		github: 'https://github.com/srgobi/BDNitro',
		github_raw: 'https://raw.githubusercontent.com/srgobi/BDNitro/main/BDNitro.plugin.js'
	},
	changelog: [
		{
			title: '5.6.1',
			items: ['Fixed an error where the plugin could not start if you had a fresh config.']
		}
	],
	settingsPanel: [
		{
			type: 'category',
			id: 'Badges',
			name: 'Badges',
			collapsible: true,
			shown: false,
			settings: [
				{ type: 'switch', id: 'certified_moderator', name: 'Moderador Certificado', note: 'Desbloquea el badge de exalumnos de la academia de moderadores', value: () => settings.certified_moderator },
				{ type: 'switch', id: 'hypesquad', name: 'Eventos del HypeSquad', note: 'Desbloquea el badge de eventos del HypeSquad', value: () => settings.hypesquad },
				{ type: 'switch', id: 'hypesquad_house_2', name: 'House Brilliance', note: 'Desbloquea el badge de contribuidor', value: () => settings.hypesquad_house_2 },
				{ type: 'switch', id: 'hypesquad_house_1', name: 'House Bravery', note: 'Desbloquea el badge de contribuidor', value: () => settings.hypesquad_house_1 },
				{ type: 'switch', id: 'hypesquad_house_3', name: 'House Balance', note: 'Desbloquea el badge de contribuidor', value: () => settings.hypesquad_house_3 },
				{ type: 'switch', id: 'bug_hunter_level_1', name: 'Bug Hunter', note: 'Desbloquea el badge de cazador de bugs', value: () => settings.bug_hunter_level_1 },
				{ type: 'switch', id: 'verified_developer', name: 'Early Bot Developer', note: 'Desbloquea el badge de desarrollador de bots temprano', value: () => settings.verified_developer },
				{ type: 'switch', id: 'NITRO', name: 'Nitro', note: 'Desbloquea el badge de Nitro', value: () => settings.NITRO },
				{ type: 'switch', id: 'early_supporter', name: 'Early Supporter', note: 'Desbloquea el badge de Early Supporter', value: () => settings.early_supporter }
			]
		},
		{
			type: 'category',
			id: 'ScreenShare',
			name: 'Screen Share Features',
			collapsible: true,
			shown: false,
			settings: [
				{ type: 'switch', id: 'screenSharing', name: 'High Quality Screensharing', note: '1080p/Source @ 60fps screensharing. Enable if you want to use any Screen Share related options.', value: () => settings.screenSharing },
				{ type: 'switch', id: 'ResolutionEnabled', name: 'Custom Screenshare Resolution', note: 'Choose your own screen share resolution!', value: () => settings.ResolutionEnabled },
				{ type: 'text', id: 'CustomResolution', name: 'Resolution', note: 'The custom resolution you want (in pixels)', value: () => settings.CustomResolution },
				{ type: 'switch', id: 'CustomFPSEnabled', name: 'Custom Screenshare FPS', note: 'Choose your own screen share FPS!', value: () => settings.CustomFPSEnabled },
				{ type: 'text', id: 'CustomFPS', name: 'FPS', note: 'The custom FPS you want to stream at.', value: () => settings.CustomFPS },
				{ type: 'switch', id: 'ResolutionSwapper', name: 'Stream Settings Quick Swapper', note: 'Adds a button that will let you switch your resolution quickly!', value: () => settings.ResolutionSwapper },
				{ type: 'switch', id: 'CustomBitrateEnabled', name: 'Custom Bitrate', note: 'Choose the bitrate for your streams!', value: () => settings.CustomBitrateEnabled },
				{ type: 'text', id: 'minBitrate', name: 'Minimum Bitrate', note: 'The minimum bitrate (in kbps). If this is set to a negative number, the Discord default of 150kbps will be used.', value: () => settings.minBitrate },
				{ type: 'text', id: 'targetBitrate', name: 'Target Bitrate', note: 'The target bitrate (in kbps). If this is set to a negative number, the Discord default of 600kbps will be used.', value: () => settings.targetBitrate },
				{ type: 'text', id: 'maxBitrate', name: 'Maximum Bitrate', note: 'The maximum bitrate (in kbps). If this is set to a negative number, the Discord default of 2500kbps will be used.', value: () => settings.maxBitrate },
				{ type: 'text', id: 'voiceBitrate', name: 'Voice Audio Bitrate', note: "Allows you to change the voice bitrate to whatever you want. Does not allow you to go over the voice channel's set bitrate but it does allow you to go much lower. (bitrate in kbps). Disabled if this is set to 128 or -1.", value: () => settings.voiceBitrate }
			]
		},
		{
			type: 'category',
			id: 'emojis',
			name: 'Emojis',
			collapsible: true,
			shown: false,
			settings: [
				{ type: 'switch', id: 'emojiBypass', name: 'Nitro Emotes Bypass', note: 'Enable or disable using the emoji bypass.', value: () => settings.emojiBypass },
				{
					type: 'dropdown',
					id: 'emojiSize',
					name: 'Size',
					note: 'The size of the emoji in pixels.',
					value: () => settings.emojiSize,
					options: [
						{ label: '32px (Default small/inline)', value: 32 },
						{ label: '48px (Recommended, default large)', value: 48 },
						{ label: '16px', value: 16 },
						{ label: '24px', value: 24 },
						{ label: '40px', value: 40 },
						{ label: '56px', value: 56 },
						{ label: '64px', value: 64 },
						{ label: '80px', value: 80 },
						{ label: '96px', value: 96 },
						{ label: '128px (Max emoji size)', value: 128 },
						{ label: '256px (Max GIF emoji size)', value: 256 }
					]
				},
				{
					type: 'dropdown',
					id: 'emojiBypassType',
					name: 'Emoji Bypass Method',
					note: 'The method of bypass to use.',
					value: () => settings.emojiBypassType,
					options: [
						{ label: 'Upload Emojis', value: 0 },
						{ label: 'Ghost Link Mode', value: 1 },
						{ label: 'Classic Mode', value: 2 },
						{ label: 'Hyperlink/Vencord-Like Mode', value: 3 }
					]
				},
				{ type: 'switch', id: 'emojiBypassForValidEmoji', name: "Don't Use Emote Bypass if Emote is Unlocked", note: 'Disable to use emoji bypass even if bypass is not required for that emoji.', value: () => settings.emojiBypassForValidEmoji },
				{ type: 'switch', id: 'PNGemote', name: 'Use PNG instead of WEBP', note: 'Use the PNG version of static emoji for higher quality!', value: () => settings.PNGemote },
				{ type: 'switch', id: 'stickerBypass', name: 'Sticker Bypass', note: "Enable or disable using the sticker bypass. I recommend using An00nymushun's DiscordFreeStickers over this. Animated APNG/WEBP/Lottie Stickers WILL NOT animate.", value: () => settings.stickerBypass },
				{ type: 'switch', id: 'uploadStickers', name: 'Upload Stickers', note: 'Upload stickers in the same way as emotes.', value: () => settings.uploadStickers },
				{ type: 'switch', id: 'forceStickersUnlocked', name: 'Force Stickers Unlocked', note: 'Enable to cause Stickers to be unlocked.', value: () => settings.forceStickersUnlocked }
			]
		},
		{
			type: 'category',
			id: 'clips',
			name: 'Clips',
			collapsible: true,
			shown: false,
			settings: [
				{ type: 'switch', id: 'useClipBypass', name: 'Use Clips Bypass', note: 'Enabling this will effectively set your file upload limit for video files to 100MB. Disable this if you have a file upload limit larger than 100MB.', value: () => settings.useClipBypass },
				{ type: 'switch', id: 'alwaysTransmuxClips', name: 'Force Transmuxing', note: 'Always transmux the video, even if transmuxing would normally be skipped. Transmuxing is only ever skipped if the codec does not include AVC1 or includes MP42.', value: () => settings.alwaysTransmuxClips },
				{ type: 'switch', id: 'forceClip', name: 'Force Clip', note: 'Always send video files as a clip, even if the size is below 10MB.', value: () => settings.forceClip }
			]
		},
		{
			type: 'category',
			id: 'miscellaneous',
			name: 'Miscellaneous',
			collapsible: true,
			shown: false,
			settings: [
				{ type: 'switch', id: 'changePremiumType', name: 'Change PremiumType', note: "This is now optional. Enabling this may help compatibility for certain things or harm it. SimpleDiscordCrypt requires this to be enabled to have the emoji bypass work. Only enable this if you don't have Nitro.", value: () => settings.changePremiumType },
				{ type: 'switch', id: 'clientThemes', name: 'Gradient Client Themes', note: 'Allows you to use Nitro-exclusive Client Themes.', value: () => settings.clientThemes },
				{ type: 'switch', id: 'removeProfileUpsell', name: 'Remove Profile Customization Upsell', note: 'Removes the "Try It Out" upsell in the profile customization screen and replaces it with the Nitro variant. Note: does not allow you to use Nitro customization on Server Profiles as the API disallows this.', value: () => settings.removeProfileUpsell },
				{ type: 'switch', id: 'removeScreenshareUpsell', name: 'Remove Screen Share Nitro Upsell', note: 'Removes the Nitro upsell in the Screen Share quality option menu.', value: () => settings.removeScreenshareUpsell },
				{ type: 'switch', id: 'unlockAppIcons', name: 'App Icons', note: 'Unlocks app icons. Warning: enabling this will force "Change Premium Type" to be enabled.', value: () => settings.unlockAppIcons },
				{ type: 'switch', id: 'experiments', name: 'Experiments', note: 'Unlocks experiments. Use at your own risk.', value: () => settings.experiments },
				{ type: 'switch', id: 'checkForUpdates', name: 'Check for Updates', note: 'Should the plugin check for updates on startup?', value: () => settings.checkForUpdates }
			]
		}
	],
	main: 'BDNitro.plugin.js'
};

module.exports = class BDNitro {
	constructor(meta) {
		this.meta = meta;
	}

	getSettingsPanel() {
		return UI.buildSettingsPanel({
			settings: config.settingsPanel,
			onChange: (category, id, value) => {
				switch (id) {
					case 'CustomResolution':
					case 'CustomFPS':
						settings[id] = parseInt(value);
						this.saveAndUpdate();
						break;
					case 'minBitrate':
					case 'targetBitrate':
					case 'maxBitrate':
					case 'voiceBitrate':
						settings[id] = parseFloat(value);
						this.saveAndUpdate();
						break;
					default:
						settings[id] = value;
						this.saveAndUpdate();
						break;
				}
			}
		});
	}

	saveAndUpdate() {
		//Saves and updates settings and runs functions
		//Utilities.saveSettings(this.meta.name, this.settings);
		Data.save(this.meta.name, 'settings', settings);
		Patcher.unpatchAll(this.meta.name);

		if (settings.changePremiumType) {
			try {
				if (!(ORIGINAL_NITRO_STATUS > 1)) {
					CurrentUser.premiumType = 1;
					setTimeout(() => {
						if (settings.changePremiumType) {
							CurrentUser.premiumType = 1;
						}
					}, 10000);
				}
			} catch (err) {
				Logger.error(this.meta.name, 'An error occurred changing premium type.' + err);
			}
		}

		if (settings.CustomFPS == 15) settings.CustomFPS = 16;
		if (settings.CustomFPS == 30) settings.CustomFPS = 31;
		if (settings.CustomFPS == 5) settings.CustomFPS = 6;

		if (document.getElementById('qualityButton')) document.getElementById('qualityButton').remove();
		if (document.getElementById('qualityMenu')) document.getElementById('qualityMenu').remove();
		if (document.getElementById('qualityInput')) document.getElementById('qualityInput').remove();

		if (settings.ResolutionSwapper) {
			try {
				this.buttonCreate(); //Fast Quality Button and Menu
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
			try {
				document.getElementById('qualityInput').addEventListener('input', this.updateQuick);
				document.getElementById('qualityInputFPS').addEventListener('input', this.updateQuick);
				if (!settings.ResolutionSwapper) {
					if (document.getElementById('qualityButton') != undefined) document.getElementById('qualityButton').style.display = 'none';
					if (document.getElementById('qualityMenu') != undefined) document.getElementById('qualityMenu').style.display = 'none';
				}
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		if (settings.stickerBypass) {
			try {
				this.stickerSending();
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		if (settings.emojiBypass) {
			try {
				this.emojiBypass();

				if (this.emojiMods == undefined) this.emojiMods = Webpack.getByKeys('isEmojiFilteredOrLocked');

				Patcher.instead(this.meta.name, this.emojiMods, 'isEmojiFilteredOrLocked', () => {
					return false;
				});
				Patcher.instead(this.meta.name, this.emojiMods, 'isEmojiDisabled', () => {
					return false;
				});
				Patcher.instead(this.meta.name, this.emojiMods, 'isEmojiFiltered', () => {
					return false;
				});
				Patcher.instead(this.meta.name, this.emojiMods, 'isEmojiPremiumLocked', () => {
					return false;
				});
				Patcher.instead(this.meta.name, this.emojiMods, 'getEmojiUnavailableReason', () => {
					return;
				});
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		if (settings.profileV2) {
			try {
				Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, args, ret) => {
					if (ret == undefined) return;
					ret.premiumType = 2;
				});
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		if (settings.screenSharing) {
			try {
				this.customVideoSettings(); //Unlock stream buttons, apply custom resolution and fps, and apply stream quality bypasses
			} catch (err) {
				Logger.error(this.meta.name, 'Error occurred during customVideoSettings() ' + err);
			}
			try {
				this.videoQualityModule(); //Custom bitrate, fps, resolution module
			} catch (err) {
				Logger.error(this.meta.name, 'Error occurred during videoQualityModule() ' + err);
			}
		}

		if (settings.forceStickersUnlocked) {
			if (this.stickerSendabilityModule == undefined) this.stickerSendabilityModule = Webpack.getByKeys('cO', 'eb', 'kl');
			//getStickerSendability
			Patcher.instead(this.meta.name, this.stickerSendabilityModule, 'cO', () => {
				return 0;
			});
			//isSendableSticker
			Patcher.instead(this.meta.name, this.stickerSendabilityModule, 'kl', () => {
				return true;
			});
		}

		if (settings.clientThemes) {
			try {
				this.clientThemes();
			} catch (err) {
				Logger.warn(this.meta.name, err);
			}
		}

		if (settings.fakeProfileThemes) {
			try {
				this.decodeAndApplyProfileColors();
				this.encodeProfileColors();
			} catch (err) {
				Logger.error(this.meta.name, 'Error occurred running fakeProfileThemes bypass. ' + err);
			}
		}

		BdApi.DOM.removeStyle(this.meta.name);

		if (settings.removeScreenshareUpsell) {
			try {
				BdApi.DOM.addStyle(
					this.meta.name,
					`
                [class*="upsellBanner"] {
                  display: none;
                  visibility: hidden;
                }`
				);
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		BdApi.DOM.removeStyle('UsrBGIntegration');

		if (settings.fakeProfileBanners) {
			this.bannerUrlDecoding();
			this.bannerUrlEncoding(this.secondsightifyEncodeOnly);
			if (settings.userBgIntegration) {
				BdApi.DOM.addStyle(
					'UsrBGIntegration',
					`
                    :is([class*="userProfile"], [class*="userPopout"]) [class*="bannerPremium"] {
                        background: center / cover no-repeat;
                    }

                    [class*="NonPremium"]:has([class*="bannerPremium"]) [class*="avatarPositionNormal"],
                    [class*="PremiumWithoutBanner"]:has([class*="bannerPremium"]) [class*="avatarPositionPremiumNoBanner"] {
                        top: 76px;
                    }

                    [style*="background-image"] [class*="background_"] {
                        background-color: transparent !important;
                    }`
				);
			}
		}

		Dispatcher.unsubscribe('COLLECTIBLES_CATEGORIES_FETCH_SUCCESS', this.storeProductsFromCategories);

		if (settings.fakeAvatarDecorations) {
			this.fakeAvatarDecorations();
		}

		if (settings.unlockAppIcons) {
			this.appIcons();
		}

		if (settings.profileEffects) {
			try {
				this.profileFX(this.secondsightifyEncodeOnly);
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}

		if (settings.killProfileEffects) {
			try {
				this.killProfileFX();
			} catch (err) {
				Logger.error(this.meta.name, 'Error occured during killProfileFX() ' + err);
			}
		}

		BdApi.DOM.removeStyle('BDNitroBadges');
		try {
			this.LoadingBadges();
		} catch (err) {
			Logger.error(this.meta.name, 'An error occurred during LoadingBadges() ' + err);
		}

		if (settings.customPFPs) {
			try {
				this.customProfilePictureDecoding();
				this.customProfilePictureEncoding(this.secondsightifyEncodeOnly);
			} catch (err) {
				Logger.error(this.meta.name, 'An error occurred during customProfilePicture decoding/encoding. ' + err);
			}
		}

		if (settings.experiments) {
			try {
				this.experiments();
			} catch (err) {
				Logger.error(this.meta.name, 'Error occurred in experiments() ' + err);
			}
		}

		//Name changed from "canUserUse"
		Patcher.instead(this.meta.name, canUserUseMod, 'ks', (_, [feature, user], originalFunction) => {
			if (settings.emojiBypass && (feature.name == 'emojisEverywhere' || feature.name == 'animatedEmojis')) {
				return true;
			}
			if (settings.appIcons && feature.name == 'appIcons') {
				return true;
			}
			if (settings.removeProfileUpsell && feature.name == 'profilePremiumFeatures') {
				return true;
			}
			if (settings.clientThemes && feature.name == 'clientThemes') {
				return true;
			}
			return originalFunction(feature, user);
		});

		//Clips Bypass
		if (settings.useClipBypass) {
			try {
				this.experiments();
				this.overrideExperiment('2023-09_clips_nitro_early_access', 2);
				this.overrideExperiment('2022-11_clips_experiment', 1);
				this.overrideExperiment('2023-10_viewer_clipping', 1);

				this.clipsBypass();
			} catch (err) {
				Logger.error(this.meta.name, err);
			}
		}
	} //End of saveAndUpdate()

	overrideExperiment(type, bucket) {
		//console.log("applying experiment override " + type + "; bucket " + bucket);
		Dispatcher.dispatch({
			type: 'EXPERIMENT_OVERRIDE_BUCKET',
			experimentId: type,
			experimentBucket: bucket
		});
	}

	async clipsBypass() {
		if (ffmpeg == undefined) await this.loadFFmpeg();

		async function ffmpegTransmux(arrayBuffer, fileName = 'input.mp4') {
			if (ffmpeg) {
				UI.showToast('Transmuxing video...', { type: 'info' });
				ffmpeg.on('log', ({ message }) => {
					console.log(message);
				});
				await ffmpeg.writeFile(fileName, new Uint8Array(arrayBuffer));
				await ffmpeg.exec(['-i', fileName, '-codec', 'copy', '-brand', 'isom/avc1', '-movflags', '+faststart', '-map', '0', '-map_metadata', '-1', '-map_chapters', '-1', 'output.mp4']);
				const data = await ffmpeg.readFile('output.mp4');

				return data.buffer;
			}
		}

		Patcher.instead(this.meta.name, Webpack.getByKeys('addFiles'), 'addFiles', async (_, [args], originalFunction) => {
			//for each file being added
			for (let i = 0; i < args.files.length; i++) {
				const currentFile = args.files[i];

				if (currentFile.file.name.endsWith('.dlfc')) return;

				//larger than 10mb
				if (currentFile.file.size > 10485759 || settings.forceClip) {
					//if this file is an mp4 file
					if (currentFile.file.type == 'video/mp4') {
						let dontStopMeNow = true;
						let mp4BoxFile = MP4Box.createFile();
						mp4BoxFile.onError = (e) => {
							Logger.error(this.meta.name, e);
							dontStopMeNow = false;
						};
						mp4BoxFile.onReady = async (info) => {
							mp4BoxFile.flush();

							try {
								//check if file is H264 or H265
								if (info.videoTracks[0].codec.startsWith('avc') || info.videoTracks[0].codec.startsWith('hev1')) {
									let hasTransmuxed = false;
									if (!info.brands.includes('avc1') || info.brands.includes('mp42') || settings.alwaysTransmuxClips) {
										arrayBuffer = await ffmpegTransmux(arrayBuffer, currentFile.file.name);
										hasTransmuxed = true;
									}

									let isMetadataPresent = false;

									//skip if we transmuxed since we know it won't have the tag
									if (!hasTransmuxed) {
										//Is this file already a Discord clip?
										for (let j = 0; j < mp4BoxFile.boxes.length; j++) {
											if (mp4BoxFile.boxes[j].type == 'uuid') {
												isMetadataPresent = true;
											}
										}
									}

									//If this file is not a Discord clip, append udtaBuffer
									if (!isMetadataPresent) {
										let array1 = ArrayBuffer.concat(arrayBuffer, udtaBuffer);

										let video = new File([new Uint8Array(array1)], currentFile.file.name, { type: 'video/mp4' });

										currentFile.file = video;
									}
								} else {
									//file is not H264 or H265, but is an mp4
									arrayBuffer = await ffmpegTransmux(arrayBuffer, currentFile.file.name);
									let array1 = ArrayBuffer.concat(arrayBuffer, udtaBuffer);
									let video = new File([new Uint8Array(array1)], currentFile.file.name, { type: 'video/mp4' });

									currentFile.file = video;
								}

								//send as a "clip"
								currentFile.clip = {
									id: '',
									version: 3,
									applicationName: '',
									applicationId: '1301689862256066560',
									users: [CurrentUser.id],
									clipMethod: 'manual',
									length: currentFile.file.size,
									thumbnail: '',
									filepath: ''
								};
							} catch (err) {
								UI.showToast('Something went wrong. See console for details.', { type: 'error' });
								Logger.error(this.meta.name, err);
							} finally {
								dontStopMeNow = false;
							}
						};

						let arrayBuffer;
						currentFile.file.arrayBuffer().then((obj) => {
							arrayBuffer = obj;
							arrayBuffer.fileStart = 0;
							//examine file with mp4Box.
							mp4BoxFile.appendBuffer(arrayBuffer);
							//onReady will run after the buffer is appended successfully
						});

						//wait for onReady to finish
						while (dontStopMeNow) {
							await new Promise((r) => setTimeout(r, 10));
						}
					} else if (currentFile.file.type.startsWith('video/')) {
						//Is a video file, but not MP4

						//AVI file warning
						if (currentFile.file.type == 'video/x-msvideo') {
							UI.showToast('[BDNitro] NOTE: AVI Files will send, but HTML5 does not support playing AVI video codecs!', { type: 'warning' });
						}
						try {
							let arrayBuffer = await currentFile.file.arrayBuffer();

							let array1 = ArrayBuffer.concat(await ffmpegTransmux(arrayBuffer, currentFile.file.name), udtaBuffer);
							let video = new File([new Uint8Array(array1)], currentFile.file.name.substr(0, currentFile.file.name.lastIndexOf('.')) + '.mp4', { type: 'video/mp4' });

							currentFile.file = video;

							//send as a "clip"
							currentFile.clip = {
								id: '',
								version: 3,
								applicationName: '',
								applicationId: '1301689862256066560',
								users: [CurrentUser.id],
								clipMethod: 'manual',
								length: currentFile.file.size,
								thumbnail: '',
								filepath: ''
							};
						} catch (err) {
							Logger.error(this.meta.name, err);
						}
					}
					currentFile.platform = 1;
				}
			}

			originalFunction(args);
		});
	} //End of clipsBypass()

	async loadFFmpeg() {
		const defineTemp = window.global.define;

		try {
			//load ffmpeg worker
			const ffmpegWorkerURL = URL.createObjectURL(await (await fetch('https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/814.ffmpeg.js', { timeout: 100000 })).blob());

			//load FFmpeg.WASM
			let ffmpegSrc = await (await fetch('https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/ffmpeg.js')).text();

			//patch worker URL in the source of ffmpeg.js (why is this a problem lmao)
			ffmpegSrc = ffmpegSrc.replace(`new URL(e.p+e.u(814),e.b)`, `"${ffmpegWorkerURL.toString()}"`);
			//blob ffmpeg
			const ffmpegURL = URL.createObjectURL(new Blob([ffmpegSrc]));

			window.global.define = undefined;

			//deprecated function, but uhhhh fuck you we need it
			await BdApi.linkJS('ffmpeg.js', ffmpegURL);

			window.global.define = defineTemp;

			ffmpeg = new FFmpegWASM.FFmpeg();

			const ffmpegCoreURL = URL.createObjectURL(await (await fetch('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js', { timeout: 100000 })).blob());

			const ffmpegCoreWasmURL = URL.createObjectURL(await (await fetch('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm', { timeout: 100000 })).blob());

			await ffmpeg.load({
				coreURL: ffmpegCoreURL,
				wasmURL: ffmpegCoreWasmURL
			});
			console.log('FFmpeg load success!');
		} catch (err) {
			UI.showToast('An error occured trying to load FFmpeg.wasm. Check console for details.', { type: 'error' });
			Logger.error(this.meta.name, err);
		} finally {
			window.global.define = defineTemp;
		}
	} //End of loadFFmpeg()

	experiments() {
		try {
			//code modified from https://gist.github.com/JohannesMP/afdf27383608c3b6f20a6a072d0be93c?permalink_comment_id=4784940#gistcomment-4784940
			let wpRequire;
			webpackChunkdiscord_app.push([
				[Math.random()],
				{},
				(req) => {
					wpRequire = req;
				}
			]);
			let u = Object.values(wpRequire.c).find((x) => x?.exports?.default?.getCurrentUser && x?.exports?.default?._dispatcher?._actionHandlers).exports.default;
			let m = Object.values(u._dispatcher._actionHandlers._dependencyGraph.nodes);

			u.getCurrentUser().flags |= 1;
			m.find((x) => x.name === 'DeveloperExperimentStore').actionHandler['CONNECTION_OPEN']();
			try {
				m.find((x) => x.name === 'ExperimentStore').actionHandler['OVERLAY_INITIALIZE']({ user: { flags: 1 } });
			} catch {}
			m.find((x) => x.name === 'ExperimentStore').storeDidChange();
		} catch (err) {
			//Logger.error(this.meta.name, err);
		}
	}

	clientThemes() {
		if (this.clientThemesModule == undefined) this.clientThemesModule = Webpack.getModule(Webpack.Filters.byProps('isPreview'));

		//delete isPreview property so that we can set our own
		delete this.clientThemesModule.isPreview;

		//this property basically unlocks the client theme buttons
		Object.defineProperty(this.clientThemesModule, 'isPreview', {
			//Enabling the nitro theme settings
			value: false,
			configurable: true,
			enumerable: true,
			writable: true
		});

		if (this.themesModule == undefined) this.themesModule = Webpack.getByKeys('V1', 'ZI');

		if (this.gradientSettingModule == undefined) this.gradientSettingModule = Webpack.getByKeys('kj', 'zO');
		const resetPreviewClientTheme = this.gradientSettingModule.kj;
		const updateBackgroundGradientPreset = this.gradientSettingModule.zO;

		//Patching saveClientTheme function.
		Patcher.instead(this.meta.name, this.themesModule, 'ZI', (_, [args]) => {
			if (args.backgroundGradientPresetId == undefined) {
				//If this number is -1, that indicates to the plugin that the current theme we're setting to is not a gradient nitro theme.
				settings.lastGradientSettingStore = -1;
				//save any changes to settings
				//Utilities.saveSettings(this.meta.name, this.settings);
				Data.save(this.meta.name, 'settings', this.settings);

				//if user is trying to set the theme to the default dark theme
				if (args.theme == 'dark') {
					//dispatch settings update to change to dark theme
					Dispatcher.dispatch({
						type: 'SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE',
						changes: {
							appearance: {
								shouldSync: false, //prevent sync to stop discord api from butting in. Since this is not a nitro theme, shouldn't this be set to true? Idk, but I'm not touching it lol.
								settings: {
									theme: 'dark', //default dark theme
									developerMode: true //genuinely have no idea what this does.
								}
							}
						}
					});
					//get rid of gradient theming.
					resetPreviewClientTheme();
					return;
				}

				//if user is trying to set the theme to the default light theme
				if (args.theme == 'light') {
					//dispatch settings update event to change to light theme
					Dispatcher.dispatch({
						type: 'SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE',
						changes: {
							appearance: {
								shouldSync: false, //prevent sync to stop discord api from butting in
								settings: {
									theme: 'light', //default light theme
									developerMode: true
								}
							}
						}
					});
				}
				return;
			} else {
				//gradient themes
				//Store the last gradient setting used in settings
				settings.lastGradientSettingStore = args.backgroundGradientPresetId;
				//save any changes to settings
				//Utilities.saveSettings(this.meta.name, this.settings);
				Data.save(this.meta.name, 'settings', this.settings);

				//dispatch settings update event to change to the gradient the user chose
				Dispatcher.dispatch({
					type: 'SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE',
					changes: {
						appearance: {
							shouldSync: false, //prevent sync to stop discord api from butting in
							settings: {
								theme: args.theme, //gradient themes are based off of either dark or light, args.theme stores this information
								clientThemeSettings: {
									backgroundGradientPresetId: args.backgroundGradientPresetId //preset ID for the gradient theme
								},
								developerMode: true
							}
						}
					}
				});

				//update background gradient preset to the one that was just chosen.
				updateBackgroundGradientPreset(settings.lastGradientSettingStore);
			}
		}); //End of saveClientTheme patch.

		//If last appearance choice was a nitro client theme
		if (settings.lastGradientSettingStore != -1) {
			//This line sets the gradient on plugin save and load.
			updateBackgroundGradientPreset(settings.lastGradientSettingStore);
		}

		if (this.accountSwitchModule == undefined) this.accountSwitchModule = Webpack.getByKeys('startSession', 'login');

		//startSession patch. This function runs upon switching accounts.
		Patcher.after(this.meta.name, this.accountSwitchModule, 'startSession', () => {
			//If last appearance choice was a nitro client theme
			setTimeout(() => {
				if (settings.lastGradientSettingStore != -1) {
					//Restore gradient on account switch
					updateBackgroundGradientPreset(settings.lastGradientSettingStore);
				}
			}, 3000);
		});
	} //End of clientThemes()

	customProfilePictureDecoding() {
		if (this.getAvatarUrlModule == undefined) this.getAvatarUrlModule = Webpack.getByPrototypeKeys('getAvatarURL').prototype;

		Patcher.instead(this.meta.name, this.getAvatarUrlModule, 'getAvatarURL', (user, [userId, size, shouldAnimate], originalFunction) => {
			//userpfp closer integration
			//if we haven't fetched userPFP database yet and it's enabled
			if ((!fetchedUserPfp || this.userPfps == undefined) && settings.userPfpIntegration) {
				const userPfpJsonUrl = 'https://raw.githubusercontent.com/UserPFP/UserPFP/main/source/data.json';

				// download userPfp data
				Net.fetch(userPfpJsonUrl)
					// parse as json
					.then((res) => res.json())
					// store res.avatars in this.userPfps
					.then((res) => (this.userPfps = res.avatars));
				//set fetchedUserPfp flag to true.
				fetchedUserPfp = true;
			}

			//if userPfp database is not undefined, has been fetched, and is enabled
			if (this.userPfps != undefined && fetchedUserPfp && settings.userPfpIntegration) {
				//and this user is in the userPfp database,
				if (this.userPfps[user.id] != undefined) {
					//return UserPFP profile picture URL.
					return this.userPfps[user.id];
				}
			}

			//get user activities
			let activities = UserStatusStore.getActivities(user.id);

			if (activities.length > 0) {
				//if user does not have a custom status, return original function.
				if (activities[0].name != 'Custom Status') return originalFunction(userId, size, shouldAnimate);

				//if user does have a custom status, assign it to customStatus variable.
				let customStatus = activities[0].state;
				//checking if anything went wrong
				if (customStatus == undefined) return originalFunction(userId, size, shouldAnimate);
				//decode any 3y3 text
				let revealedText = this.secondsightifyRevealOnly(String(customStatus));
				//if there is no 3y3 encoded text, return original function.
				if (revealedText == undefined) return originalFunction(userId, size, shouldAnimate);

				//This regex matches /P{*} . (Do not fuck with this)
				let regex = /P\{[^}]*?\}/;

				//Check if there are any matches in the custom status.
				let matches = revealedText.toString().match(regex);
				//if not, return orig function
				if (matches == undefined) return originalFunction(userId, size, shouldAnimate);
				if (matches == '') return originalFunction(userId, size, shouldAnimate);

				//if there is a match, take the first match and remove the starting "P{ and ending "}"
				let matchedText = matches[0].replace('P{', '').replace('}', '');

				//look for a file extension. If omitted, fallback to .gif .
				if (!String(matchedText).endsWith('.gif') && !String(matchedText).endsWith('.png') && !String(matchedText).endsWith('.jpg') && !String(matchedText).endsWith('.jpeg') && !String(matchedText).endsWith('.webp')) {
					matchedText += '.gif'; //No supported file extension detected. Falling back to a default file extension.
				}

				//add this user to the list of users who have the BDNitro user badge if we haven't added them already.
				if (!badgeUserIDs.includes(user.id)) badgeUserIDs.push(user.id);

				//return imgur url
				return `https://i.imgur.com/${matchedText}`;
			}

			//if user does not have any activities active, return original function.
			return originalFunction(userId, size, shouldAnimate);
		});
	}

	//Custom PFP profile customization buttons and encoding code.
	async customProfilePictureEncoding(secondsightifyEncodeOnly) {
		//wait for avatar customization section renderer to be loaded
		await Webpack.waitForModule(Webpack.Filters.byStrings('showRemoveAvatarButton', 'isTryItOutFlow'));
		//store avatar customization section renderer module
		if (this.customPFPSettingsRenderMod == undefined)
			this.customPFPSettingsRenderMod = Webpack.getAllByKeys('Z')
				.filter((obj) => obj.Z.toString().includes('showRemoveAvatarButton'))
				.filter((obj) => obj.Z.toString().includes('isTryItOutFlow'))[0];

		Patcher.after(this.meta.name, this.customPFPSettingsRenderMod, 'Z', (_, [args], ret) => {
			//don't need to do anything if this is the "Try out Nitro" flow.
			if (args.isTryItOutFlow) return;

			ret.props.children.props.children.push(
				React.createElement('input', {
					id: 'profilePictureUrlInput',
					style: {
						width: '30%',
						height: '20%',
						maxHeight: '50%',
						marginTop: '5px',
						marginLeft: '5px'
					},
					placeholder: 'Imgur URL'
				})
			);

			//Create and append Copy PFP 3y3 button.
			ret.props.children.props.children.push(
				React.createElement('button', {
					children: 'Copy PFP 3y3',
					className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
					id: 'profilePictureButton',
					style: {
						marginLeft: '10px',
						whiteSpace: 'nowrap'
					},
					onClick: async function () {
						//on copy pfp 3y3 button click

						//grab text from pfp url input textarea.
						let profilePictureUrlInputValue = String(document.getElementById('profilePictureUrlInput').value);

						//empty, skip.
						if (profilePictureUrlInputValue == '') return;
						if (profilePictureUrlInputValue == undefined) return;

						//clean up string to encode
						let stringToEncode =
							'' +
							profilePictureUrlInputValue
								//clean up URL
								.replace('http://', '') //remove protocol
								.replace('https://', '')
								.replace('i.imgur.com', 'imgur.com');

						let encodedStr = ''; //initialize encoded string as empty string
						stringToEncode = String(stringToEncode); //make doubly sure stringToEncode is a string

						//if url seems correct
						if (stringToEncode.toLowerCase().startsWith('imgur.com')) {
							//Check for album or gallery URL
							if (stringToEncode.replace('imgur.com/', '').startsWith('a/') || stringToEncode.replace('imgur.com/', '').startsWith('gallery/')) {
								//Album URL, what follows is all to get the direct image link, since the album URL is not a direct link to the file.

								//Fetch imgur album page
								try {
									const parser = new DOMParser();
									stringToEncode = await Net.fetch('https://' + stringToEncode, {
										method: 'GET',
										mode: 'cors'
									}).then((res) =>
										res
											.text()
											//parse html, queryselect meta tag with certain name
											.then((res) => parser.parseFromString(res, 'text/html').querySelector('[name="twitter:player"]').content)
									);
									stringToEncode = stringToEncode
										.replace('http://', '') //get rid of protocol
										.replace('https://', '') //get rid of protocol
										.replace('i.imgur.com', 'imgur.com')
										.replace('.jpg', '')
										.replace('.jpeg', '')
										.replace('.webp', '')
										.replace('.png', '')
										.replace('.mp4', '')
										.replace('.webm', '')
										.replace('.gifv', '')
										.replace('.gif', '') //get rid of any file extension
										.split('?')[0]; //remove any URL parameters since we don't want or need them
								} catch (err) {
									Logger.error(this.meta.name, err);
									BdApi.UI.showToast('An error occurred. Are there multiple images in this album/gallery?', { type: 'error' });
									return;
								}
							}
							if (stringToEncode == '') {
								BdApi.UI.showToast("An error occurred: couldn't find file name.", { type: 'error' });
								Logger.error(this.meta.name, "Couldn't find file name for some reason. Contact SrGobi!");
							}

							//add starting "P{" , remove "imgur.com/" , and add ending "}"
							stringToEncode = 'P{' + stringToEncode.replace('imgur.com/', '') + '}';
							//finally encode the string, adding a space before it so nothing fucks up
							encodedStr = ' ' + secondsightifyEncodeOnly(stringToEncode);
							//let the user know what has happened
							BdApi.UI.showToast('3y3 copied to clipboard!', { type: 'info' });

							//If this is not an Imgur URL, yell at the user.
						} else if (stringToEncode.toLowerCase().startsWith('imgur.com') == false) {
							BdApi.UI.showToast('Please use Imgur!', { type: 'warning' });
							return;
						}

						//if somehow none of the previous code ran, this is the last protection against an error. If this runs, something has probably gone horribly wrong.
						if (encodedStr == '') return;

						//Do this stupid shit that Chrome forces you to do to copy text to the clipboard.
						const clipboardTextElem = document.createElement('textarea'); //create a textarea
						clipboardTextElem.style.position = 'fixed'; //this is so that the rest of the document doesn't try to format itself to fit a textarea in it
						clipboardTextElem.value = encodedStr; //add the encoded string to the textarea
						document.body.appendChild(clipboardTextElem); //add the textarea to the document
						clipboardTextElem.select(); //focus the textarea?
						clipboardTextElem.setSelectionRange(0, 99999); //select all of the text in the textarea
						document.execCommand('copy'); //finally send the copy command
						document.body.removeChild(clipboardTextElem); //get rid of the evidence
					} //end copy pfp 3y3 click event
				}) //end of react createElement
			); //end of element push
		}); //end of patch
	} //End of customProfilePictureEncoding()

	// Aplicar badges customizados
	LoadingBadges() {
		// Uso de la insignia de usuario de BDNitro
		BdApi.DOM.addStyle(
			'BDNitroBadges',
			`
        a[aria-label="¡Un compañero usuario de BDNitro!"] img {
            content: url("https://raw.githubusercontent.com/SrGobi/BDNitro/main/badges/bd_user.svg") !important;
        }
        
        div [aria-label="¡Un compañero usuario de BDNitro!"] > a > img {
            content: url("https://raw.githubusercontent.com/SrGobi/BDNitro/main/badges/bd_user.svg") !important;
        }
    `
		);

		// Configura las prioridades de las insignias
		const badgeConfig = {
			certified_moderator: {
				id: 'certified_moderator',
				icon: 'fee1624003e2fee35cb398e125dc479b',
				description: 'Exalumnos de la academia de moderadores',
				link: 'https://discord.com/safety',
				priority: 1
			},
			hypesquad: {
				id: 'hypesquad',
				icon: 'bf01d1073931f921909045f3a39fd264',
				description: 'HypeSquad Events',
				link: 'https://support.discord.com/hc/en-us/articles/360035962891-Profile-Badges-101#h_01GM67K5EJ16ZHYZQ5MPRW3JT3',
				priority: 2
			},
			hypesquad_house_1: {
				id: 'hypesquad_house_1',
				icon: '8a88d63823d8a71cd5e390baa45efa02',
				description: 'Bravery de HypeSquad',
				link: 'https://discord.com/settings/hypesquad-online',
				priority: 3
			},
			hypesquad_house_2: {
				id: 'hypesquad_house_2',
				icon: '011940fd013da3f7fb926e4a1cd2e618',
				description: 'House of Brilliance',
				link: 'https://discord.com/settings/hypesquad-online',
				priority: 4
			},
			hypesquad_house_3: {
				id: 'hypesquad_house_3',
				icon: '3aa41de486fa12454c3761e8e223442e',
				description: 'Balance de HypeSquad',
				link: 'https://discord.com/settings/hypesquad-online',
				priority: 5
			},
			bug_hunter_level_1: {
				id: 'bug_hunter_level_1',
				icon: '2717692c7dca7289b35297368a940dd0',
				description: 'Discord Bug Hunter',
				link: 'https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs',
				priority: 6
			},
			verified_developer: {
				id: 'verified_developer',
				icon: '6df5892e0f35b051f8b61eace34f4967',
				description: 'Desarrollador inicial de bots verificado',
				link: '',
				priority: 7
			},
			NITRO: {
				id: 'NITRO',
				icon: '2ba85e8026a8614b640c2837bcdfe21b',
				description: 'Nitro User',
				link: 'https://github.com/srgobi/BDNitro#contributors',
				priority: 8
			},
			bd_user: {
				id: 'bd_user',
				icon: '2ba85e8026a8614b640c2837bcdfe21b',
				description: '¡Un compañero usuario de BDNitro!',
				link: 'https://github.com/srgobi/BDNitro',
				priority: 9
			},
			early_supporter: {
				description: 'Partidario inicial',
				icon: '7060786766c9c840eb3019e725d2b358',
				id: 'early_supporter',
				link: 'https://discord.com/settings/premium',
				priority: 10
			}
		};

		// Parches de insignia de perfil de usuario
		Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, args, ret) => {
			// Comprobaciones de datos
			if (ret == undefined) return;
			if (ret.userId == undefined) return;
			if (ret.badges == undefined) return;

			const badgesList = []; // Lista de ID de credencial del usuario actualmente procesado

			for (let i = 0; i < ret.badges.length; i++) {
				badgesList.push(ret.badges[i].id); // Agregar cada una de las ID de insignia de este usuario a BadgesList
			}

			// Añadir insignias personalizadas a la lista si no están ya presentes
			if (badgeUserIDs.includes(ret.userId) && !badgesList.includes('bd_user')) {
				ret.badges.push(badgeConfig['bd_user']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.certified_moderator && !badgesList.includes('certified_moderator')) {
				ret.badges.push(badgeConfig['certified_moderator']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.hypesquad && !badgesList.includes('hypesquad')) {
				ret.badges.push(badgeConfig['hypesquad']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.hypesquad_house_1 && !badgesList.includes('hypesquad_house_1')) {
				ret.badges.push(badgeConfig['hypesquad_house_1']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.hypesquad_house_2 && !badgesList.includes('hypesquad_house_2')) {
				ret.badges.push(badgeConfig['hypesquad_house_2']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.hypesquad_house_3 && !badgesList.includes('hypesquad_house_3')) {
				ret.badges.push(badgeConfig['hypesquad_house_3']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.bug_hunter_level_1 && !badgesList.includes('bug_hunter_level_1')) {
				ret.badges.push(badgeConfig['bug_hunter_level_1']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.verified_developer && !badgesList.includes('verified_developer')) {
				ret.badges.push(badgeConfig['verified_developer']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.NITRO && !badgesList.includes('NITRO')) {
				ret.badges.push(badgeConfig['NITRO']);
			}

			if (badgeUserIDs.includes(ret.userId) && settings.early_supporter && !badgesList.includes('early_supporter')) {
				ret.badges.push(badgeConfig['early_supporter']);
			}

			// Ordenar las insignias en función de su prioridad
			ret.badges.sort((a, b) => {
				const priorityA = badgeConfig[a.id]?.priority || Number.MAX_VALUE;
				const priorityB = badgeConfig[b.id]?.priority || Number.MAX_VALUE;
				return priorityA - priorityB;
			});
		}); // Fin del parche de getUserProfile
	} // Fin de LoadingBadges()

	secondsightifyRevealOnly(t) {
		if ([...t].some((x) => 0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f)) {
			// 3y3 text detected. Revealing...
			return ((t) => [...t].map((x) => (0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f ? String.fromCodePoint(x.codePointAt(0) - 0xe0000) : x)).join(''))(t);
		} else {
			// no encoded text found, returning
			return;
		}
	}

	secondsightifyEncodeOnly(t) {
		if ([...t].some((x) => 0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f)) {
			// 3y3 text detected. returning...
			return;
		} else {
			//3y3 text detected. revealing...
			return ((t) => [...t].map((x) => (0x00 < x.codePointAt(0) && x.codePointAt(0) < 0x7f ? String.fromCodePoint(x.codePointAt(0) + 0xe0000) : x)).join(''))(t);
		}
	}

	//Everything related to Fake Profile Effects.
	async profileFX(secondsightifyEncodeOnly) {
		if (settings.killProfileEffects) return; //profileFX is mutually exclusive with killProfileEffects (obviously)

		//wait for profile effects module
		await Webpack.waitForModule(Webpack.Filters.byProps('profileEffects', 'tryItOutId'));

		//try to get profile effects data
		if (this.profileEffects == undefined) this.profileEffects = Webpack.getStore('ProfileEffectStore').profileEffects;
		if (this.fetchProfileEffects == undefined) this.fetchProfileEffects = Webpack.getAllByKeys('z').filter((obj) => obj.z.toString().includes('USER_PROFILE_EFFECTS_FETCH'))[0].z;

		//if profile effects data hasn't been fetched by the client yet
		if (this.profileEffects == undefined) {
			//make the client fetch profile effects
			await this.fetchProfileEffects('Failed to fetch profile effects.');
			//then wait for the effects to be fetched and store them
			this.profileEffects = Webpack.getStore('ProfileEffectStore').profileEffects;
		} else if (this.profileEffects.length == 0) {
			await this.fetchProfileEffects('Failed to fetch profile effects.');
			this.profileEffects = Webpack.getStore('ProfileEffectStore').profileEffects;
		}

		let profileEffectIdList = new Array();
		for (let i = 0; i < this.profileEffects.length; i++) {
			profileEffectIdList.push(this.profileEffects[i].id);
		}

		Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, [args], ret) => {
			//error prevention
			if (ret == undefined) return;
			if (ret.bio == undefined) return;

			//reveal 3y3 encoded text. this string will also include the rest of the bio
			let revealedText = this.secondsightifyRevealOnly(ret.bio);
			if (revealedText == undefined) return;

			//if profile effect 3y3 is detected
			if (revealedText.includes('/fx')) {
				const regex = /\/fx\d+/;
				let matches = revealedText.toString().match(regex);
				if (matches == undefined) return;
				let firstMatch = matches[0];
				if (firstMatch == undefined) return;

				//slice the /fx and only take the number after it.
				let effectIndex = parseInt(firstMatch.slice(3));
				//ignore invalid data
				if (isNaN(effectIndex)) return;
				//ignore if the profile effect id does not point to an actual profile effect
				if (profileEffectIdList[effectIndex] == undefined) return;
				//set the profile effect. stringify it.
				ret.profileEffectId = profileEffectIdList[effectIndex] + '';

				//if for some reason we dont know what this user's ID is, stop here
				if (args == undefined) return;
				//otherwise add them to the list of users who show up with the BDNitro user badge
				if (!badgeUserIDs.includes(args)) badgeUserIDs.push(args);
			}
		}); //end of getUserProfile patch.

		//wait for profile effect section renderer to be loaded.
		await Webpack.waitForModule(Webpack.Filters.byStrings('initialSelectedEffectId'));

		//fetch the module now that it's loaded
		if (this.profileEffectSectionRenderer == undefined) this.profileEffectSectionRenderer = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('initialSelectedEffectId'))[0];

		//patch profile effect section renderer function to run the following code after the function runs
		Patcher.after(this.meta.name, this.profileEffectSectionRenderer, 'Z', (_, [args], ret) => {
			//if this is the tryItOut flow, don't do anything.
			if (args.isTryItOutFlow) return;

			let profileEffectChildren = [];

			//for each profile effect
			for (let i = 0; i < this.profileEffects.length; i++) {
				//get preview image url
				let previewURL = this.profileEffects[i].config.thumbnailPreviewSrc;
				let title = this.profileEffects[i].config.title;
				//encode 3y3
				let encodedText = secondsightifyEncodeOnly('/fx' + i); //fx0, fx1, etc.
				//javascript that runs onclick for each profile effect button
				let copyDecoration3y3 = function () {
					const clipboardTextElem = document.createElement('textarea');
					clipboardTextElem.style.position = 'fixed';
					clipboardTextElem.value = ` ${encodedText}`;
					document.body.appendChild(clipboardTextElem);
					clipboardTextElem.select();
					clipboardTextElem.setSelectionRange(0, 99999);
					document.execCommand('copy');
					BdApi.UI.showToast('3y3 copied to clipboard!', { type: 'info' });
					document.body.removeChild(clipboardTextElem);
				};

				profileEffectChildren.push(
					React.createElement('img', {
						className: 'riolubruhsSecretStuff',
						onClick: copyDecoration3y3,
						src: previewURL,
						title,
						style: {
							width: '22.5%',
							cursor: 'pointer',
							marginBottom: '0.5em',
							marginLeft: '0.5em',
							backgroundColor: 'var(--background-tertiary)'
						}
					})
				);

				//add newline every 4th profile effect
				if ((i + 1) % 4 == 0) {
					profileEffectChildren.push(React.createElement('br'));
				}
			}

			//Profile Effects Modal
			function EffectsModal() {
				const elem = React.createElement('div', {
					style: {
						width: '100%',
						display: 'block',
						color: 'white',
						whiteSpace: 'nowrap',
						overflow: 'visible',
						marginTop: '.5em'
					},
					children: profileEffectChildren
				});
				return elem;
			}

			//Append Change Effect button
			ret.props.children.props.children.push(
				//self explanatory create react element
				React.createElement('button', {
					children: 'Change Effect [BDNitro]',
					className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
					size: 'sizeSmall__71a98',
					id: 'changeProfileEffectButton',
					style: {
						width: '100px',
						height: '32px',
						color: 'white',
						marginLeft: '10px'
					},
					onClick: () => {
						UI.showConfirmationModal('Change Profile Effect (BDNitro)', React.createElement(EffectsModal));
					}
				})
			);
		}); //end patch of profile effect section renderer function
	} //End of profileFX()

	killProfileFX() {
		//self explanatory
		Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, args, ret) => {
			if (ret == undefined) return;
			if (ret.profileEffectID == undefined) return;
			//self explanatory
			ret.profileEffectID = undefined;
		});
	}

	//Everything related to fake avatar decorations.

	storeProductsFromCategories = (event) => {
		if (event.categories) {
			event.categories.forEach((category) => {
				category.products.forEach((product) => {
					product.items.forEach((item) => {
						if (item.asset) {
							Object.assign(settings.avatarDecorations)[item.id] = item.asset;
						}
					});
				});
			});
		}
	};

	async fakeAvatarDecorations() {
		//keep track of profiles downloaded
		Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, [args], ret) => {
			if (ret == undefined) return;
			if (ret.userId == undefined) return;
			if (downloadedUserProfiles[args]) return;
			downloadedUserProfiles.push(ret.userId);
		});

		//apply decorations
		Patcher.after(this.meta.name, UserStore, 'getUser', (_, args, ret) => {
			//basic error checking
			if (args == undefined) return;
			if (args[0] == undefined) return;
			if (ret == undefined) return;
			let avatarDecorations = settings.avatarDecorations;

			function getRevealedText(self) {
				let revealedTextLocal = ''; //init empty string with local scope

				//if this user's profile has been downloaded
				if (downloadedUserProfiles[args[0]]) {
					//get the user's profile from the cached user profiles
					let userProfile = userProfileMod.getUserProfile(args[0]);

					//if their bio is empty, move on to the next check.
					if (userProfile?.bio != undefined) {
						//reveal 3y3 encoded text
						revealedTextLocal = self.secondsightifyRevealOnly(String(userProfile.bio));
						//if there's no 3y3 text, move on to the next check.
						if (revealedTextLocal != undefined) {
							if (String(revealedTextLocal).includes('/a')) {
								//return bio with the 3y3 decoded
								return revealedTextLocal;
							}
						}
					}
				}
				let activities = UserStatusStore.getActivities(args[0]);
				if (activities.length > 0) {
					//grab user's activities (this includes custom status)

					//if they don't have a custom status, stop processing.
					if (activities[0].name != 'Custom Status') return;
					//otherwise, grab the text from the custom status
					let customStatus = activities[0].state;
					//if something has gone horribly wrong, stop processing.
					if (customStatus == undefined) return;
					//finally reveal 3y3 encoded text
					revealedTextLocal = self.secondsightifyRevealOnly(String(customStatus));
					//return custom status with the 3y3 decoded
					return revealedTextLocal;
				}
			}
			let revealedText = getRevealedText(this);
			//if nothing's returned, or an empty string is returned, stop processing.
			if (revealedText == undefined) return;
			if (revealedText == '') return;

			//Matches the characters "/a" and any numbers after the a
			const regex = /\/a\d+/;
			let matches = revealedText.toString().match(regex);
			if (matches == undefined) return;
			let firstMatch = matches[0];
			if (firstMatch == undefined) return;

			//slice off the /a and just store the ID number
			let assetId = firstMatch.slice(2);

			//if this decoration is not in the list, return
			if (avatarDecorations[assetId] == undefined) return;

			//if this user does not have an avatar decoration, or the avatar decoration data does not match the one in the avatar decorations array,
			if (ret.avatarDecorationData == undefined || ret.avatarDecorationData?.asset != avatarDecorations[assetId]) {
				//set avatar decoration data to fake avatar decoration
				ret.avatarDecorationData = {
					asset: avatarDecorations[assetId],
					sku_id: '1144003461608906824' //dummy sku id
				};

				//add user to the list of users to show with the BDNitro user badge we haven't already.
				if (!badgeUserIDs.includes(ret.id)) badgeUserIDs.push(ret.id);
			}
		}); //end of getUser patch for avatar decorations

		//subscribe to successful collectible category fetch event
		Dispatcher.subscribe('COLLECTIBLES_CATEGORIES_FETCH_SUCCESS', this.storeProductsFromCategories);

		//trigger decorations fetch
		FetchCollectibleCategories({
			includeBundles: true,
			includeUnpublished: false,
			noCache: false,
			paymentGateway: undefined
		});

		//Wait for avatar decor customization section render module to be loaded.
		await Webpack.waitForModule(Webpack.Filters.byStrings('userAvatarDecoration'));

		//Avatar decoration customization section render module/function.
		if (!this.decorationCustomizationSectionMod) this.decorationCustomizationSectionMod = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('userAvatarDecoration'))[0];

		//Avatar decoration customization section patch
		Patcher.after(this.meta.name, this.decorationCustomizationSectionMod, 'Z', (_, [args], ret) => {
			//don't run if this is the try out nitro flow.
			if (args.isTryItOutFlow) return;

			//push change decoration button
			ret.props.children[0].props.children.push(
				React.createElement('button', {
					id: 'decorationButton',
					children: 'Change Decoration [BDNitro]',
					style: {
						width: '100px',
						height: '50px',
						color: 'white',
						borderRadius: '3px',
						marginLeft: '5px'
					},
					className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
					onClick: () => {
						UI.showConfirmationModal('Change Avatar Decoration (BDNitro)', React.createElement(DecorModal));
					}
				})
			);

			let listOfDecorationIds = Object.keys(BdApi.getData(this.meta.name, 'settings').avatarDecorations);
			let avatarDecorationChildren = [];

			//for each avatar decoration
			for (let i = 0; i < listOfDecorationIds.length; i++) {
				//text to encode to 3y3
				let encodedText = this.secondsightifyEncodeOnly('/a' + listOfDecorationIds[i]); // /a[id]
				//javascript that runs onclick for each avatar decoration button
				let copyDecoration3y3 = function () {
					const clipboardTextElem = document.createElement('textarea');
					clipboardTextElem.style.position = 'fixed';
					clipboardTextElem.value = ` ${encodedText}`;
					document.body.appendChild(clipboardTextElem);
					clipboardTextElem.select();
					clipboardTextElem.setSelectionRange(0, 99999);
					document.execCommand('copy');
					BdApi.UI.showToast('3y3 copied to clipboard!', { type: 'info' });
					document.body.removeChild(clipboardTextElem);
				};
				let child = React.createElement('img', {
					style: {
						width: '23%',
						cursor: 'pointer',
						marginLeft: '5px',
						marginBottom: '10px',
						borderRadius: '4px',
						backgroundColor: 'var(--background-tertiary)'
					},
					onClick: copyDecoration3y3,
					src: 'https://cdn.discordapp.com/avatar-decoration-presets/' + settings.avatarDecorations[listOfDecorationIds[i]] + '.png?size=64'
				});
				avatarDecorationChildren.push(child);

				//add newline every 4th decoration
				if ((i + 1) % 4 == 0) {
					//avatarDecorationsHTML += "<br>"
					avatarDecorationChildren.push(React.createElement('br'));
				}
			}

			function DecorModal() {
				return React.createElement('div', {
					style: {
						width: '100%',
						display: 'block',
						color: 'white',
						whiteSpace: 'nowrap',
						overflow: 'visible',
						marginTop: '.5em'
					},
					children: avatarDecorationChildren
				});
			}
		}); //end patch of profile decoration section renderer function
	} //End of fakeAvatarDecorations()

	async UploadEmote(url, channelIdLmao, msg, emoji, runs) {
		if (emoji === undefined) {
			let emoji;
		}

		if (msg === undefined) {
			let msg;
		}

		let extension = '.gif';
		if (!emoji.animated) {
			extension = '.png';
			if (!settings.PNGemote) {
				extension = '.webp';
			}
		}

		//Download emote by URL, convert to blob, then convert to File object
		let file = await fetch(url)
			.then((r) => r.blob())
			.then((blobFile) => new File([blobFile], emoji.name + extension));
		file.platform = 1; // Not exactly sure what this does, but it should be set to 1.
		file.spoiler = false; //not marked as spoiler.

		//Start file upload
		let fileUp = new CloudUploader({ file: file, isClip: false, isThumbnail: false, platform: 1 }, channelIdLmao, false, 0);
		fileUp.isImage = true;

		//Options for the upload
		let uploadOptions = new Object();
		uploadOptions.channelId = channelIdLmao; //Upload to current channel
		uploadOptions.uploads = [fileUp]; //The file from before
		uploadOptions.draftType = 0; // Not sure what this does.
		uploadOptions.options = {
			stickerIds: [] //No stickers in the message
		};
		//Message attached to the upload.
		uploadOptions.parsedMessage = { channelId: channelIdLmao, content: msg[1].content, tts: false, invalidEmojis: [] };

		//if this is not the first emoji uploaded
		if (runs > 1) {
			//make the message attached to the upload have no text
			uploadOptions.parsedMessage = { channelId: channelIdLmao, content: '', tts: false, invalidEmojis: [] };
		}

		try {
			await Uploader.uploadFiles(uploadOptions); //finally finish the process of uploading
		} catch (err) {
			Logger.error(this.meta.name, err);
		}
	}

	//Whether we should skip the emoji bypass for a given emoji.
	// true = skip bypass
	// false = perform bypass
	emojiBypassForValidEmoji(emoji, currentChannelId) {
		if (settings.emojiBypassForValidEmoji) {
			if (
				(SelectedGuildStore.getLastSelectedGuildId() == emoji.guildId && !emoji.animated && (ChannelStore.getChannel(currentChannelId.toString()).type <= 0 || ChannelStore.getChannel(currentChannelId.toString()).type == 11) && emoji.available) ||
				//If emoji is from current guild, not animated, and we are actually in a guild channel,
				//and emoji is "available" (could be unavailable due to Server Boost level dropping), cancel emoji bypass

				emoji.managed
			) {
				// OR if emoji is "managed" (emoji.managed = whether the emoji is managed by a Twitch integration)
				return true;
			}
		}
		return false;
	}

	customVideoSettings() {
		//Unlock stream buttons, apply custom resolution and fps, and apply stream quality bypasses
		//If you're trying to figure this shit out yourself, I recommend uncommenting the line below.
		//console.log(StreamButtons);

		//Nice try, Discord.
		Patcher.instead(this.meta.name, StreamButtons, 'L9', (_, [args]) => {
			//getApplicationFramerate
			return args;
		});
		Patcher.instead(this.meta.name, StreamButtons, 'aW', (_, [args]) => {
			//getApplicationResolution
			return args;
		});

		//If custom resolution is enabled and the resolution is not set to 0,
		if (settings.ResolutionEnabled && settings.CustomResolution != 0) {
			//some of these properties are marked as read only, but they still allow you to delete them
			//so any time you see "delete", what we're doing is bypassing the read-only thing by deleting it and immediately remaking it.
			delete ApplicationStreamResolutions.RESOLUTION_1440;
			//Change 1440p resolution internally to custom resolution
			ApplicationStreamResolutions.RESOLUTION_1440 = settings.CustomResolution;

			//********************************** Requirements below this point*************************************
			ApplicationStreamSettingRequirements[4].resolution = settings.CustomResolution;
			ApplicationStreamSettingRequirements[5].resolution = settings.CustomResolution;
			ApplicationStreamSettingRequirements[6].resolution = settings.CustomResolution;

			//************************************Buttons below this point*****************************************
			//Set resolution button value to custom resolution
			ApplicationStreamResolutionButtons[2].value = settings.CustomResolution;
			delete ApplicationStreamResolutionButtons[2].label;
			//Set label of resolution button to custom resolution. This one is used in the popup window that appears before you start streaming.
			ApplicationStreamResolutionButtons[2].label = settings.CustomResolution.toString();

			//Set value of button with suffix label to custom resolution
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = settings.CustomResolution;
			delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
			//Set label of button with suffix label to custom resolution with "p" after it, ex: "1440p"
			//This one is used in the dropdown kind of menu after you've started streaming
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = settings.CustomResolution + 'p';
		}

		//If custom resolution tick is disabled or custom resolution is set to 0,
		if (!settings.ResolutionEnabled || settings.CustomResolution == 0) {
			//Reset all values to defaults.
			delete ApplicationStreamResolutions.RESOLUTION_1440;
			ApplicationStreamResolutions.RESOLUTION_1440 = 1440;
			ApplicationStreamSettingRequirements[4].resolution = 1440;
			ApplicationStreamSettingRequirements[5].resolution = 1440;
			ApplicationStreamSettingRequirements[6].resolution = 1440;
			ApplicationStreamResolutionButtons[2].value = 1440;
			delete ApplicationStreamResolutionButtons[2].label;
			ApplicationStreamResolutionButtons[2].label = '1440';
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = 1440;
			delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = '1440p';
		}

		//Removes stream setting requirements
		function removeQualityParameters(x) {
			try {
				delete x.quality;
			} catch (err) {}
			try {
				delete x.guildPremiumTier;
			} catch (err) {}
		}

		/*Remove each of the stream setting requirements 
        (which basically just tell your client what premiumType / guildPremiumTier you need to access that resolution)
        removing the setting requirements makes it default to thinking that every premiumType can use it.*/
		ApplicationStreamSettingRequirements.forEach(removeQualityParameters);
		function replace60FPSRequirements(x) {
			if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = BdApi.getData('BDNitro', 'settings').CustomFPS;
		}
		function restore60FPSRequirements(x) {
			if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = 60;
		}

		//If Custom FPS is enabled and does not equal 60,
		if (settings.CustomFPSEnabled && this.CustomFPS != 60) {
			//remove FPS nitro requirements
			ApplicationStreamSettingRequirements.forEach(replace60FPSRequirements);
			//set suffix label button value to the custom number
			ApplicationStreamFPSButtonsWithSuffixLabel[2].value = settings.CustomFPS;
			delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
			//set button suffix label with the correct number with " FPS" after it. ex: "75 FPS". This one is used in the dropdown kind of menu
			ApplicationStreamFPSButtonsWithSuffixLabel[2].label = settings.CustomFPS + ' FPS';
			//set fps button value to the correct number.
			ApplicationStreamFPSButtons[2].value = settings.CustomFPS;
			delete ApplicationStreamFPSButtons[2].label;
			//set fps button label to the correct number. This one is used in the popup window that appears before you start streaming.
			ApplicationStreamFPSButtons[2].label = settings.CustomFPS;
			ApplicationStreamFPS.FPS_60 = settings.CustomFPS;
		}

		//If custom FPS toggle is disabled, or custom fps is set to the default of 60,
		if (!settings.CustomFPSEnabled || this.CustomFPS == 60) {
			//Reset all values to defaults.
			ApplicationStreamSettingRequirements.forEach(restore60FPSRequirements);
			ApplicationStreamFPSButtonsWithSuffixLabel[2].value = 60;
			delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
			ApplicationStreamFPSButtonsWithSuffixLabel[2].label = '60 FPS';
			ApplicationStreamFPSButtons[2].value = 60;
			delete ApplicationStreamFPSButtons[2].label;
			ApplicationStreamFPSButtons[2].label = 60;
			ApplicationStreamFPS.FPS_60 = 60;
		}
	} //End of customVideoSettings()

	emojiBypass() {
		//Upload Emotes Method
		if (settings.emojiBypassType == 0) {
			Patcher.instead(this.meta.name, MessageActions, '_sendMessage', (_, msg, send) => {
				if (msg[2].poll != undefined || msg[2].activityAction != undefined || msg[2].messageReference) {
					//fix polls, activity actions, forwarding
					send(msg[0], msg[1], msg[2], msg[3]);
					return;
				}

				//SimpleDiscordCrypt compat
				if (document.getElementsByClassName('sdc-tooltip').length > 0) {
					let SDC_Tooltip = document.getElementsByClassName('sdc-tooltip')[0];
					if (SDC_Tooltip.innerHTML == 'Disable Encryption') {
						//SDC Encryption Enabled
						send(msg[0], msg[1], msg[2], msg[3]);
						return;
					}
				}

				console.log(msg);

				const currentChannelId = msg[0];
				let runs = 0; //number of times the uploader has run for this message
				msg[1].validNonShortcutEmojis.forEach((emoji) => {
					if (this.emojiBypassForValidEmoji(emoji, currentChannelId)) return; //Unlocked emoji. Skip.
					if (emoji.type == 'UNICODE') return; //If this "emoji" is actually a unicode character, it doesn't count. Skip bypassing if so.
					if (emoji.guildId === undefined || emoji.id === undefined || emoji.useSpriteSheet) return; //Skip system emoji.
					if (settings.PNGemote) {
						emoji.forcePNG = true; //replace WEBP with PNG if the option is enabled.
					}
					let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
					if (emoji.animated) {
						emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
					}

					//If there is a backslash (\) before the emote we are processing,
					if (msg[1].content.includes('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>')) {
						//remove the backslash
						msg[1].content = msg[1].content.replace('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>', '<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>');
						//and skip bypass for that emote
						return;
					}

					runs++; // increment number of times the uploader has run for this message.

					//remove existing URL parameters and add custom URL parameters for user's size preference. quality is always lossless.
					emojiUrl = emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless&`;
					//remove emote from message.
					msg[1].content = msg[1].content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, '');
					//upload emote
					this.UploadEmote(emojiUrl, currentChannelId, msg, emoji, runs);
				});
				if (msg[1].content !== undefined && (msg[1].content != '' || msg[2].activityAction != undefined) && runs == 0) {
					send(msg[0], msg[1], msg[2], msg[3]);
				}
			});

			Patcher.instead(this.meta.name, Uploader, 'uploadFiles', (_, [args], originalFunction) => {
				if (document.getElementsByClassName('sdc-tooltip').length > 0) {
					let SDC_Tooltip = document.getElementsByClassName('sdc-tooltip')[0];
					if (SDC_Tooltip.innerHTML == 'Disable Encryption') {
						//SDC Encryption Enabled
						originalFunction(args);
						return;
					}
				}
				const currentChannelId = args.channelId;
				let emojis = [];
				let runs = 0;

				if (args.parsedMessage.validNonShortcutEmojis != undefined) {
					if (args.parsedMessage.validNonShortcutEmojis.length > 0) {
						args.parsedMessage.validNonShortcutEmojis.forEach((emoji) => {
							if (this.emojiBypassForValidEmoji(emoji, currentChannelId)) return; //Unlocked emoji. Skip.
							if (emoji.type == 'UNICODE') return; //If this "emoji" is actually a unicode character, it doesn't count. Skip bypassing if so.
							if (settings.PNGemote) {
								emoji.forcePNG = true; //replace WEBP with PNG if the option is enabled.
							}

							let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
							if (emoji.guildId === undefined || emoji.id === undefined || emoji.useSpriteSheet) return; //Skip system emoji.
							if (emoji.animated) {
								emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
							}

							//If there is a backslash (\) before the emote we are processing,
							if (args.parsedMessage.content.includes('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>')) {
								//remove the backslash
								args.parsedMessage.content = args.parsedMessage.content.replace('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>', '<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>');
								//and skip bypass for that emote
								return;
							}

							//add to list of emojis
							emojis.push(emoji);

							//remove emote from message.
							args.parsedMessage.content = args.parsedMessage.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, '');
						});

						//send file with text and shit
						originalFunction(args);

						//loop through emotes to send one at a time
						for (let i = 0; i < emojis.length; i++) {
							let emoji = emojis[i];
							let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
							if (emoji.animated) {
								emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
							}

							//remove existing URL parameters and add custom URL parameters for user's size preference. quality is always lossless.
							emojiUrl = emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless&`;

							this.UploadEmote(emojiUrl, currentChannelId, [currentChannelId, { content: '', tts: false, invalidEmojis: [] }], emoji, 1);
						}
					} else {
						originalFunction(args);
					}
				} else {
					originalFunction(args);
				}
			});
		}

		//Ghost mode method
		const ghostmodetext =
			'||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ ';

		if (settings.emojiBypassType == 1) {
			function ghostModeMethod(msg, currentChannelId, self) {
				if (document.getElementsByClassName('sdc-tooltip').length > 0) {
					let SDC_Tooltip = document.getElementsByClassName('sdc-tooltip')[0];
					if (SDC_Tooltip.innerHTML == 'Disable Encryption') {
						//SDC Encryption Enabled
						return;
					}
				}
				let emojiGhostIteration = 0; // dummy value we add to the end of the URL parameters to make the same emoji appear more than once despite having the same URL.
				msg.validNonShortcutEmojis.forEach((emoji) => {
					if (self.emojiBypassForValidEmoji(emoji, currentChannelId)) return;
					if (emoji.type == 'UNICODE') return;
					if (settings.PNGemote) emoji.forcePNG = true;

					let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
					if (emoji.guildId === undefined || emoji.id === undefined || emoji.useSpriteSheet) return; //Skip system emoji.
					if (emoji.animated) {
						emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
					}

					if (msg.content.includes('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>')) {
						msg.content = msg.content.replace('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>', '<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>');
						return; //If there is a backslash before the emoji, skip it.
					}

					//if ghost mode is not required
					if (msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, '') == '') {
						msg.content = msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless& `);
						return;
					}
					emojiGhostIteration++; //increment dummy value

					//if message already has ghostmodetext.
					if (msg.content.includes(ghostmodetext)) {
						//remove processed emoji from the message
						(msg.content = msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, '')),
							//add to the end of the message
							(msg.content += ' ' + emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless&${emojiGhostIteration}& `);
						return;
					}
					//if message doesn't already have ghostmodetext, remove processed emoji and add it to the end of the message with the ghost mode text
					(msg.content = msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, '')), (msg.content += ghostmodetext + '\n' + emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless& `);
				});
			}

			//sending message in ghost mode
			Patcher.before(this.meta.name, MessageActions, 'sendMessage', (_, [currentChannelId, msg]) => {
				ghostModeMethod(msg, currentChannelId, this);
			});

			//uploading file with emoji in the message in ghost mode.
			Patcher.before(this.meta.name, Uploader, 'uploadFiles', (_, [args], originalFunction) => {
				const currentChannelId = args.channelId;
				const msg = args.parsedMessage;
				ghostModeMethod(msg, currentChannelId, this);
			});
		}

		//Original method
		if (settings.emojiBypassType == 2) {
			function classicModeMethod(msg, currentChannelId, self) {
				if (document.getElementsByClassName('sdc-tooltip').length > 0) {
					let SDC_Tooltip = document.getElementsByClassName('sdc-tooltip')[0];
					if (SDC_Tooltip.innerHTML == 'Disable Encryption') {
						//SDC Encryption Enabled
						return;
					}
				}
				//refer to previous bypasses for comments on what this all is for.
				let emojiGhostIteration = 0;
				msg.validNonShortcutEmojis.forEach((emoji) => {
					if (self.emojiBypassForValidEmoji(emoji, currentChannelId)) return;
					if (emoji.type == 'UNICODE') return;
					if (settings.PNGemote) emoji.forcePNG = true;

					let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
					if (emoji.guildId === undefined || emoji.id === undefined || emoji.useSpriteSheet) return; //Skip system emoji.
					if (emoji.animated) {
						emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
					}

					if (msg.content.includes('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>')) {
						msg.content = msg.content.replace('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>', '<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>');
						return; //If there is a backslash before the emoji, skip it.
					}
					emojiGhostIteration++;
					msg.content = msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless&${emojiGhostIteration}& `);
				});
			}

			//sending message in classic mode
			Patcher.before(this.meta.name, MessageActions, 'sendMessage', (_, [currentChannelId, msg]) => {
				classicModeMethod(msg, currentChannelId, this);
			});

			//uploading file with emoji in the message in classic mode.
			Patcher.before(this.meta.name, Uploader, 'uploadFiles', (_, [args], originalFunction) => {
				const msg = args.parsedMessage;
				const currentChannelId = args.channelId;
				classicModeMethod(msg, currentChannelId, this);
			});

			//editing message in classic mode
			Patcher.before(this.meta.name, MessageActions, 'editMessage', (_, obj) => {
				let msg = obj[2].content;
				if (msg.search(/\d{18}/g) == -1) return;
				if (msg.includes(':ENC:')) return; //Fix jank with editing SimpleDiscordCrypt encrypted messages.
				msg.match(/<a:.+?:\d{18}>|<:.+?:\d{18}>/g).forEach((idfkAnymore) => {
					obj[2].content = obj[2].content.replace(idfkAnymore, `https://cdn.discordapp.com/emojis/${idfkAnymore.match(/\d{18}/g)[0]}?size=${settings.emojiSize}&quality=lossless&`);
				});
			});
		}

		//Vencord-like bypass
		if (settings.emojiBypassType == 3) {
			function vencordModeMethod(msg, currentChannelId, self) {
				if (document.getElementsByClassName('sdc-tooltip').length > 0) {
					let SDC_Tooltip = document.getElementsByClassName('sdc-tooltip')[0];
					if (SDC_Tooltip.innerHTML == 'Disable Encryption') {
						//SDC Encryption Enabled
						return;
					}
				}
				//refer to previous bypasses for comments on what this all is for.
				let emojiGhostIteration = 0;
				msg.validNonShortcutEmojis.forEach((emoji) => {
					if (self.emojiBypassForValidEmoji(emoji, currentChannelId)) return;
					if (emoji.type == 'UNICODE') return;
					if (settings.PNGemote) emoji.forcePNG = true;

					let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
					if (emoji.guildId === undefined || emoji.id === undefined || emoji.useSpriteSheet) return; //Skip system emoji.
					if (emoji.animated) {
						emojiUrl = emojiUrl.substr(0, emojiUrl.lastIndexOf('.')) + '.gif';
					}

					if (msg.content.includes('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>')) {
						msg.content = msg.content.replace('\\<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>', '<' + emoji.allNamesString.replace(/~\b\d+\b/g, '') + emoji.id + '>');
						return; //If there is a backslash before the emoji, skip it.
					}
					emojiGhostIteration++;
					msg.content = msg.content.replace(`<${emoji.animated ? 'a' : ''}${emoji.allNamesString.replace(/~\b\d+\b/g, '')}${emoji.id}>`, `[${emoji.name}](` + emojiUrl.split('?')[0] + `?size=${settings.emojiSize}&quality=lossless&${emojiGhostIteration}&)`);
				});
			}

			//sending message in vencord-like mode
			Patcher.before(this.meta.name, MessageActions, 'sendMessage', (_, [currentChannelId, msg]) => {
				vencordModeMethod(msg, currentChannelId, this);
			});

			//uploading file with emoji in the message in vencord-like mode.
			Patcher.before(this.meta.name, Uploader, 'uploadFiles', (_, [args], originalFunction) => {
				const msg = args.parsedMessage;
				const currentChannelId = args.channelId;
				vencordModeMethod(msg, currentChannelId, this);
			});
		}
	} //End of emojiBypass()

	updateQuick() {
		//Function that runs when the resolution/fps quick menu is changed.
		//Refer to customVideoSettings function for comments on what this all does, since this code is just a copy-paste from there.
		const settings = BdApi.getData('BDNitro', 'settings');
		parseInt(document.getElementById('qualityInput').value);
		settings.CustomResolution = parseInt(document.getElementById('qualityInput').value);
		parseInt(document.getElementById('qualityInputFPS').value);
		settings.CustomFPS = parseInt(document.getElementById('qualityInputFPS').value);
		if (parseInt(document.getElementById('qualityInputFPS').value) == 15) settings.CustomFPS = 16;
		if (parseInt(document.getElementById('qualityInputFPS').value) == 30) settings.CustomFPS = 31;
		if (parseInt(document.getElementById('qualityInputFPS').value) == 5) settings.CustomFPS = 6;

		if (settings.ResolutionEnabled && settings.CustomResolution != 0) {
			delete ApplicationStreamResolutions.RESOLUTION_1440;
			ApplicationStreamResolutions.RESOLUTION_1440 = settings.CustomResolution;
			ApplicationStreamSettingRequirements[4].resolution = settings.CustomResolution;
			ApplicationStreamSettingRequirements[5].resolution = settings.CustomResolution;
			ApplicationStreamSettingRequirements[6].resolution = settings.CustomResolution;
			ApplicationStreamResolutionButtons[2].value = settings.CustomResolution;
			delete ApplicationStreamResolutionButtons[2].label;
			ApplicationStreamResolutionButtons[2].label = settings.CustomResolution.toString();
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = settings.CustomResolution;
			delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = settings.CustomResolution + 'p';
		}
		if (!settings.ResolutionEnabled || settings.CustomResolution == 0) {
			delete ApplicationStreamResolutions.RESOLUTION_1440;
			ApplicationStreamResolutions.RESOLUTION_1440 = 1440;
			ApplicationStreamSettingRequirements[4].resolution = 1440;
			ApplicationStreamSettingRequirements[5].resolution = 1440;
			ApplicationStreamSettingRequirements[6].resolution = 1440;
			ApplicationStreamResolutionButtons[2].value = 1440;
			delete ApplicationStreamResolutionButtons[2].label;
			ApplicationStreamResolutionButtons[2].label = '1440';
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = 1440;
			delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
			ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = '1440p';
		}
		function replace60FPSRequirements(x) {
			if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = BdApi.getData('BDNitro', 'settings').CustomFPS;
		}
		function restore60FPSRequirements(x) {
			if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = 60;
		}

		if (settings.CustomFPSEnabled) {
			if (this.CustomFPS != 60) {
				ApplicationStreamSettingRequirements.forEach(replace60FPSRequirements);
				ApplicationStreamFPSButtonsWithSuffixLabel[2].value = settings.CustomFPS;
				delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
				ApplicationStreamFPSButtonsWithSuffixLabel[2].label = settings.CustomFPS + ' FPS';
				ApplicationStreamFPSButtons[2].value = settings.CustomFPS;
				delete ApplicationStreamFPSButtons[2].label;
				ApplicationStreamFPSButtons[2].label = settings.CustomFPS;
				ApplicationStreamFPS.FPS_60 = settings.CustomFPS;
			}
		}
		if (!settings.CustomFPSEnabled || this.CustomFPS == 60) {
			ApplicationStreamSettingRequirements.forEach(restore60FPSRequirements);
			ApplicationStreamFPSButtonsWithSuffixLabel[2].value = 60;
			delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
			ApplicationStreamFPSButtonsWithSuffixLabel[2].label = 60 + ' FPS';
			ApplicationStreamFPSButtons[2].value = 60;
			delete ApplicationStreamFPSButtons[2].label;
			ApplicationStreamFPSButtons[2].label = 60;
			ApplicationStreamFPS.FPS_60 = 60;
		}
		Data.save('BDNitro', 'settings', settings);
	} //End of updateQuick()

	videoQualityModule() {
		//Custom Bitrates, FPS, Resolution
		if (this.videoOptionFunctions == undefined) this.videoOptionFunctions = Webpack.getByPrototypeKeys('updateVideoQuality').prototype;

		Patcher.before(this.meta.name, this.videoOptionFunctions, 'updateVideoQuality', (e) => {
			if (!e.videoQualityManager.qualityOverwrite) e.videoQualityManager.qualityOverwrite = {};

			if (settings.minBitrate > 0 && settings.CustomBitrateEnabled) {
				//Minimum Bitrate
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateMin = settings.minBitrate * 1000;
				e.videoQualityManager.qualityOverwrite.bitrateMin = settings.minBitrate * 1000;
				e.videoQualityManager.options.videoBitrateFloor = settings.minBitrate * 1000;
				e.videoQualityManager.options.videoBitrate.min = settings.minBitrate * 1000;
				e.videoQualityManager.options.desktopBitrate.min = settings.minBitrate * 1000;
			} else {
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateMin = 150000;
				e.videoQualityManager.qualityOverwrite.bitrateMin = 150000;
				e.videoQualityManager.options.videoBitrateFloor = 150000;
				e.videoQualityManager.options.videoBitrate.min = 150000;
				e.videoQualityManager.options.desktopBitrate.min = 150000;
			}

			if (settings.maxBitrate > 0 && settings.CustomBitrateEnabled) {
				//Maximum Bitrate
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateMax = settings.maxBitrate * 1000;
				e.videoQualityManager.qualityOverwrite.bitrateMax = settings.maxBitrate * 1000;
				e.videoQualityManager.options.videoBitrate.max = settings.maxBitrate * 1000;
				e.videoQualityManager.options.desktopBitrate.max = settings.maxBitrate * 1000;
			} else {
				//Default max bitrate
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateMax = 2500000;
				e.videoQualityManager.qualityOverwrite.bitrateMax = 2500000;
				e.videoQualityManager.options.videoBitrate.max = 2500000;
				e.videoQualityManager.options.desktopBitrate.max = 2500000;
			}

			if (settings.targetBitrate > 0 && settings.CustomBitrateEnabled) {
				//Target Bitrate
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateTarget = settings.targetBitrate * 1000;
				e.videoQualityManager.qualityOverwrite.bitrateTarget = settings.targetBitrate * 1000;
				e.videoQualityManager.options.desktopBitrate.target = settings.targetBitrate * 1000;
			} else {
				//Default target bitrate
				e.framerateReducer.sinkWants.qualityOverwrite.bitrateTarget = 600000;
				e.videoQualityManager.qualityOverwrite.bitrateTarget = 600000;
				e.videoQualityManager.options.desktopBitrate.target = 600000;
			}

			if (settings.voiceBitrate != 128 && settings.voiceBitrate != -1) {
				//Audio Bitrate
				e.voiceBitrate = settings.voiceBitrate * 1000;

				e.conn.setTransportOptions({
					encodingVoiceBitRate: e.voiceBitrate
				});
			}

			//Video quality bypasses if Custom FPS is enabled.
			if (settings.CustomFPSEnabled) {
				//This is pretty self-explanatory.
				e.videoQualityManager.options.videoBudget.framerate = settings.CustomFPS;
				e.videoQualityManager.options.videoCapture.framerate = settings.CustomFPS;
			}

			//If screen sharing bypasses are enabled,
			if (settings.screenSharing) {
				//Ensure video quality parameters match the stream parameters.
				const videoQuality = new Object({
					width: e.videoStreamParameters[0].maxResolution.width,
					height: e.videoStreamParameters[0].maxResolution.height,
					framerate: e.videoStreamParameters[0].maxFrameRate
				});

				if (e.stats?.camera != undefined && settings.CustomFPSEnabled) {
					videoQuality.framerate = settings.CustomFPS;
				}

				e.remoteSinkWantsMaxFramerate = e.videoStreamParameters[0].maxFrameRate;

				//janky fix to #218
				if (videoQuality.width <= 0) {
					videoQuality.width = 2160;
					if (parseInt(settings.CustomResolution * (16 / 9) > 2160 * (16 / 9))) videoQuality.width = parseInt(settings.CustomResolution * (16 / 9));
				}
				if (videoQuality.height <= 0) {
					videoQuality.height = 1440;
					if (settings.CustomResolution > 1440) videoQuality.width = settings.CustomResolution;
				}

				//Ensure video budget quality parameters match stream parameters
				e.videoQualityManager.options.videoBudget = videoQuality;
				//Ensure video capture quality parameters match stream parameters
				e.videoQualityManager.options.videoCapture = videoQuality;

				//janky camera bypass
				if (e.stats?.camera != undefined) {
					for (let i = 0; i < e.videoStreamParameters.length; i++) {
						if (settings.ResolutionEnabled && settings.CustomResolution > -1) {
							e.videoStreamParameters[i].maxResolution.height = settings.CustomResolution;
							e.videoStreamParameters[i].maxResolution.width = parseInt((16 / 9) * settings.CustomResolution);
							e.videoStreamParameters[i].maxPixelCount = e.videoStreamParameters[i].maxResolution.height * e.videoStreamParameters[i].maxResolution.width;
						}
						if (settings.CustomFPSEnabled && settings.CustomFPS > -1) e.videoStreamParameters[i].maxFrameRate = settings.CustomFPS;
					}
				}

				//Ladder bypasses
				let pixelBudget = videoQuality.width * videoQuality.height;
				e.videoQualityManager.ladder.pixelBudget = pixelBudget;
				e.videoQualityManager.ladder.ladder = LadderModule.calculateLadder(pixelBudget);
				e.videoQualityManager.ladder.orderedLadder = LadderModule.calculateOrderedLadder(e.videoQualityManager.ladder.ladder);
			}

			// Video codecs
			//todo: rewrite video codecs to actually work
		});
	} //End of videoQualityModule()

	buttonCreate() {
		//Creates the FPS and Resolution Swapper
		let qualityButton = document.createElement('button');
		qualityButton.id = 'qualityButton';
		qualityButton.className = `${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand}`;
		qualityButton.innerHTML = '<p style="display: block-inline; margin-left: -6%; margin-top: -4.5%;">Quality</p>';
		qualityButton.style.position = 'absolute';
		qualityButton.style.zIndex = '2';
		qualityButton.style.bottom = '0';
		qualityButton.style.left = '50%';
		qualityButton.style.transform = 'translateX(-50%)';
		qualityButton.style.height = '15px';
		qualityButton.style.width = '48px';
		qualityButton.style.verticalAlign = 'middle';
		qualityButton.style.textAlign = 'left';
		qualityButton.style.borderTopLeftRadius = '5px';
		qualityButton.style.borderTopRightRadius = '4px';
		qualityButton.style.borderBottomLeftRadius = '4px';
		qualityButton.style.borderBottomRightRadius = '4px';

		qualityButton.onclick = function () {
			if (qualityMenu.style.visibility == 'hidden') {
				qualityMenu.style.visibility = 'visible';
			} else {
				qualityMenu.style.visibility = 'hidden';
			}
		};

		try {
			document.getElementsByClassName(AccountDetailsClasses.container)[0].appendChild(qualityButton);
		} catch (err) {
			Logger.error(this.meta.name, 'What the fuck happened..? During buttonCreate() ' + err);
		}

		let qualityMenu = document.createElement('div');
		qualityMenu.id = 'qualityMenu';
		qualityMenu.style.visibility = 'hidden';
		qualityMenu.style.position = 'relative';
		qualityMenu.style.zIndex = '1';
		qualityMenu.style.bottom = '410%';
		qualityMenu.style.left = '-59%';
		qualityMenu.style.height = '20px';
		qualityMenu.style.width = '100px';
		qualityMenu.onclick = function (event) {
			event.stopPropagation();
		};

		document.getElementById('qualityButton').appendChild(qualityMenu);

		let qualityInput = document.createElement('input');
		qualityInput.id = 'qualityInput';
		qualityInput.type = 'text';
		qualityInput.placeholder = 'Resolution';
		qualityInput.style.width = '33%';
		qualityInput.style.zIndex = '1';
		qualityInput.value = settings.CustomResolution;
		qualityMenu.appendChild(qualityInput);

		let qualityInputFPS = document.createElement('input');
		qualityInputFPS.id = 'qualityInputFPS';
		qualityInputFPS.type = 'text';
		qualityInputFPS.placeholder = 'FPS';
		qualityInputFPS.style.width = '33%';
		qualityInputFPS.style.zIndex = '1';
		qualityInputFPS.value = settings.CustomFPS;
		qualityMenu.appendChild(qualityInputFPS);
	} //End of buttonCreate()

	async stickerSending() {
		if (this.stickerSendabilityModule == undefined) this.stickerSendabilityModule = Webpack.getByKeys('cO', 'eb', 'kl');

		//getStickerSendability
		Patcher.instead(this.meta.name, this.stickerSendabilityModule, 'cO', () => {
			return 0;
		});

		//isSendableSticker
		Patcher.instead(this.meta.name, this.stickerSendabilityModule, 'kl', () => {
			return true;
		});

		Patcher.instead(this.meta.name, MessageActions, 'sendStickers', (_, args, originalFunction) => {
			let stickerID = args[1][0];
			let stickerURL = 'https://media.discordapp.net/stickers/' + stickerID + '.png?size=4096&quality=lossless';
			let currentChannelId = SelectedChannelStore.getChannelId();

			if (settings.uploadStickers) {
				let emoji = new Object();
				emoji.animated = false;
				emoji.name = args[0];
				let msg = [undefined, { content: '' }];
				this.UploadEmote(stickerURL, currentChannelId, [undefined, { content: '' }], emoji);
				return;
			}
			if (!settings.uploadStickers) {
				let messageContent = { content: stickerURL, tts: false, invalidEmojis: [], validNonShortcutEmojis: [] };
				MessageActions.sendMessage(currentChannelId, messageContent, undefined, {});
			}
		});
	}

	decodeAndApplyProfileColors() {
		Patcher.after(this.meta.name, userProfileMod, 'getUserProfile', (_, args, ret) => {
			if (ret == undefined) return;
			if (ret.bio == null) return;
			const colorString = ret.bio.match(/\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u);
			if (colorString == null) return;
			let parsed = [...colorString[0]].map((c) => String.fromCodePoint(c.codePointAt(0) - 0xe0000)).join('');
			let colors = parsed
				.substring(1, parsed.length - 1)
				.split(',')
				.map((x) => parseInt(x.replace('#', '0x'), 16));
			ret.themeColors = colors;
			ret.premiumType = 2;
		});
	}

	//Everything that has to do with the GUI and encoding of the fake profile colors 3y3 shit.
	//Replaced DOM manipulation with React patching 4/2/2024
	async encodeProfileColors(primary, accent) {
		//wait for theme color picker module to be loaded
		await Webpack.waitForModule(Webpack.Filters.byProps('getTryItOutThemeColors'));

		//wait for color picker renderer module to be loaded
		await Webpack.waitForModule(Webpack.Filters.byStrings('__invalid_profileThemesSection'));

		if (this.colorPickerRendererMod == undefined) this.colorPickerRendererMod = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('__invalid_profileThemesSection'))[0];

		Patcher.after(this.meta.name, this.colorPickerRendererMod, 'Z', (_, args, ret) => {
			ret.props.children.props.children.push(
				//append copy colors 3y3 button
				React.createElement('button', {
					id: 'copy3y3button',
					children: 'Copy Colors 3y3',
					className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
					style: {
						marginLeft: '10px',
						marginTop: '10px'
					},
					onClick: () => {
						let themeColors = null;
						try {
							themeColors = Webpack.getStore('UserSettingsAccountStore').getAllTryItOut().tryItOutThemeColors;
						} catch (err) {
							Logger.warn(this.meta.name, err);
						}
						if (themeColors == null) {
							try {
								themeColors = Webpack.getStore('UserSettingsAccountStore').getAllPending().pendingThemeColors;
							} catch (err) {
								Logger.error(this.meta.name, err);
							}
						}
						if (themeColors == undefined) {
							UI.showToast('Nothing has been copied. Is the selected color identical to your current color?', { type: 'warning' });
							return;
						}
						const primary = themeColors[0];
						const accent = themeColors[1];
						let message = `[#${primary.toString(16).padStart(6, '0')},#${accent.toString(16).padStart(6, '0')}]`;
						const padding = '';
						let encoded = Array.from(message)
							.map((x) => x.codePointAt(0))
							.filter((x) => x >= 0x20 && x <= 0x7f)
							.map((x) => String.fromCodePoint(x + 0xe0000))
							.join('');

						let encodedStr = (padding || '') + ' ' + encoded;

						//do this stupid shit Chrome makes you do to copy text to the clipboard.
						const clipboardTextElem = document.createElement('textarea');
						clipboardTextElem.style.position = 'fixed';
						clipboardTextElem.value = encodedStr;
						document.body.appendChild(clipboardTextElem);
						clipboardTextElem.select();
						clipboardTextElem.setSelectionRange(0, 99999);
						document.execCommand('copy');
						UI.showToast('3y3 copied to clipboard!', { type: 'info' });
						document.body.removeChild(clipboardTextElem);
					}
				})
			);
		});
	} //End of encodeProfileColors()

	//Decode 3y3 from profile bio and apply fake banners.
	bannerUrlDecoding() {
		let endpoint, bucket, prefix, data;

		//if userBg integration is enabled, and we havent already downloaded & parsed userBg data,
		if (settings.userBgIntegration && !fetchedUserBg) {
			//userBg database url.
			const userBgJsonUrl = 'https://usrbg.is-hardly.online/users';

			//download, then store json
			Net.fetch(userBgJsonUrl, { timeout: 100000 }).then((res) =>
				res.json().then((res) => {
					data = res;
					endpoint = res.endpoint;
					bucket = res.bucket;
					prefix = res.prefix;
					usrBgUsers = Object.keys(res.users);
					//mark db as fetched so we only fetch it once per load of the plugin
					fetchedUserBg = true;
				})
			);
		}

		//Patch getUserBannerURL function
		Patcher.before(this.meta.name, AvatarDefaults, 'getUserBannerURL', (_, args) => {
			args[0].canAnimate = true;
		});

		//Patch getBannerURL function
		Patcher.instead(this.meta.name, getBannerURL, 'getBannerURL', (user, [args], ogFunction) => {
			let profile = user._userProfile;

			//Returning ogFunction with the same arguments that were passed to this function will do the vanilla check for a legit banner.
			if (profile == undefined) return ogFunction(args);

			if (settings.userBgIntegration) {
				//if userBg integration is enabled
				//if we've fetched the userbg database
				if (fetchedUserBg) {
					//if user is in userBg database,
					if (usrBgUsers.includes(user.userId)) {
						profile.banner = 'funky_kong_is_epic'; //set banner id to fake value
						profile.premiumType = 2; //set this profile to appear with premium rendering
						return `${endpoint}/${bucket}/${prefix}${user.userId}?${data.users[user.userId]}`; //return userBg banner URL and exit.
					}
				}
			}

			//do original function if we don't have the user's bio
			if (profile.bio == undefined) return ogFunction(args);

			//reveal 3y3 encoded text, store as parsed
			let parsed = this.secondsightifyRevealOnly(profile.bio);
			//if there is no 3y3 encoded text, return original function
			if (parsed == undefined) return ogFunction(args);

			//This regex matches /B{*} . Do not touch unless you know what you are doing.
			let regex = /B\{[^}]*?\}/;

			//find banner url in parsed bio
			let matches = parsed.toString().match(regex);

			//if there's no matches, return original function
			if (matches == undefined) return ogFunction(args);
			if (matches == '') return ogFunction(args);

			//if there is matched text, grab the first match, replace the starting "B{" and ending "}" to get the clean filename
			let matchedText = matches[0].replace('B{', '').replace('}', '');

			//Checking for file extension.
			if (!String(matchedText).endsWith('.gif') && !String(matchedText).endsWith('.png') && !String(matchedText).endsWith('.jpg') && !String(matchedText).endsWith('.jpeg') && !String(matchedText).endsWith('.webp')) {
				matchedText += '.gif'; //Fallback to a default file extension if one is not found.
			}

			//set banner id to fake value
			profile.banner = 'funky_kong_is_epic';

			//set this profile to appear with premium rendering
			profile.premiumType = 2;

			//add this user to the list of users that show with the BDNitro user badge if we haven't aleady.
			if (!badgeUserIDs.includes(user.userId)) badgeUserIDs.push(user.userId);

			//return final banner URL.
			return `https://i.imgur.com/${matchedText}`;
		}); //End of patch for getBannerURL

		if (this.profileRenderer == undefined) this.profileRenderer = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('PRESS_PREMIUM_UPSELL'))[0];

		Patcher.before(this.meta.name, this.profileRenderer, 'Z', (_, args) => {
			if (args == undefined) return;
			if (args[0]?.displayProfile?.banner == undefined) return;

			//if this user's banner is a fake banner
			if (args[0].displayProfile.banner == 'funky_kong_is_epic') {
				//don't show upsell
				args[0].showPremiumBadgeUpsell = false;
			}
		});

		Patcher.after(this.meta.name, this.profileRenderer, 'Z', (_, args, ret) => {
			if (args == undefined) return;
			if (args[0]?.displayProfile?.banner == undefined) return;
			if (ret == undefined) return;
			if (ret.props?.hasBanner == undefined) return;
			//if this user's banner is a fake banner
			if (args[0].displayProfile.banner == 'funky_kong_is_epic') {
				//tell the profile renderer to show them as having a banner.
				ret.props.hasBanner = true;
			}
		});
	} //End of bannerUrlDecoding()

	//Make buttons in profile customization settings, encode imgur URLs and copy to clipboard
	//Documented/commented and partially rewritten to use React patching on 3/6/2024
	async bannerUrlEncoding(secondsightifyEncodeOnly) {
		//wait for banner customization renderer module to be loaded
		await Webpack.waitForModule(Webpack.Filters.byStrings('showRemoveBannerButton', 'isTryItOutFlow', 'buttonsContainer'));
		this.profileBannerSectionRenderer = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('showRemoveBannerButton') && obj.Z.toString().includes('isTryItOutFlow') && obj.Z.toString().includes('buttonsContainer'))[0];

		Patcher.after(this.meta.name, this.profileBannerSectionRenderer, 'Z', (_, args, ret) => {
			//create and append profileBannerUrlInput input element.
			let profileBannerUrlInput = React.createElement('input', {
				id: 'profileBannerUrlInput',
				placeholder: 'Imgur URL',
				style: {
					float: 'right',
					width: '30%',
					height: '20%',
					maxHeight: '50%',
					marginTop: 'auto',
					marginBottom: 'auto',
					marginLeft: '10px'
				}
			});
			ret.props.children.props.children.push(profileBannerUrlInput);

			ret.props.children.props.children.push(
				//append Copy 3y3 button
				//create react element

				React.createElement('button', {
					id: 'profileBannerButton',
					children: 'Copy Banner 3y3',
					className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
					size: 'sizeSmall__71a98',
					style: {
						whiteSpace: 'nowrap',
						marginLeft: '10px'
					},
					onClick: async function () {
						//Upon clicking Copy 3y3 button

						//grab text from banner URL input textarea
						let profileBannerUrlInputValue = String(document.getElementById('profileBannerUrlInput').value);

						//if it's empty, stop processing.
						if (profileBannerUrlInputValue == '') return;
						if (profileBannerUrlInputValue == undefined) return;

						//clean up string to encode
						let stringToEncode =
							'' +
							profileBannerUrlInputValue
								.replace('http://', '') //get rid of protocol
								.replace('https://', '')
								.replace('.jpg', '')
								.replace('.png', '')
								.replace('.mp4', '')
								.replace('webm', '')
								.replace('i.imgur.com', 'imgur.com'); //change i.imgur.com to imgur.com

						let encodedStr = ''; //initialize encoded string as empty string

						stringToEncode = String(stringToEncode); //make doubly sure stringToEncode is a string

						//if url seems correct
						if (stringToEncode.toLowerCase().startsWith('imgur.com')) {
							//Check for album or gallery URL
							if (stringToEncode.replace('imgur.com/', '').startsWith('a/') || stringToEncode.replace('imgur.com/', '').startsWith('gallery/')) {
								//Album URL, what follows is all to get the direct image link, since the album URL is not a direct link to the file.

								//Fetch imgur album page
								try {
									const parser = new DOMParser();
									stringToEncode = await Net.fetch('https://' + stringToEncode, {
										method: 'GET',
										mode: 'cors'
									}).then((res) =>
										res
											.text()
											//parse html, queryselect meta tag with certain name
											.then((res) => parser.parseFromString(res, 'text/html').querySelector('[name="twitter:player"]').content)
									);
									stringToEncode = stringToEncode
										.replace('http://', '') //get rid of protocol
										.replace('https://', '') //get rid of protocol
										.replace('i.imgur.com', 'imgur.com')
										.replace('.jpg', '')
										.replace('.jpeg', '')
										.replace('.webp', '')
										.replace('.png', '')
										.replace('.mp4', '')
										.replace('.webm', '')
										.replace('.gifv', '')
										.replace('.gif', '') //get rid of any file extension
										.split('?')[0]; //remove any URL parameters since we don't want or need them
								} catch (err) {
									Logger.error(this.meta.name, err);
									BdApi.UI.showToast('An error occurred. Are there multiple images in this album/gallery?', { type: 'error' });
									return;
								}
							}
							if (stringToEncode == '') {
								BdApi.UI.showToast("An error occurred: couldn't find file name.", { type: 'error' });
								Logger.error(this.meta.name, "Couldn't find file name for some reason. Contact SrGobi.");
							}
							//add starting "B{" , remove "imgur.com/" , and add ending "}"
							stringToEncode = 'B{' + stringToEncode.replace('imgur.com/', '') + '}';
							//finally encode the string, adding a space before it so nothing fucks up
							encodedStr = ' ' + secondsightifyEncodeOnly(stringToEncode);
							//let the user know what has happened
							UI.showToast('3y3 copied to clipboard!', { type: 'info' });

							//If this is not an Imgur URL, yell at the user.
						} else if (stringToEncode.toLowerCase().startsWith('imgur.com') == false) {
							UI.showToast('Please use Imgur!', { type: 'warning' });
							return;
						}

						//if somehow none of the previous code ran, this is the last protection against an error. If this runs, something has probably gone horribly wrong.
						if (encodedStr == '') return;

						//Do this stupid shit that Chrome forces you to do to copy text to the clipboard.
						const clipboardTextElem = document.createElement('textarea'); //create a textarea
						clipboardTextElem.style.position = 'fixed'; //this is so that the rest of the document doesn't try to format itself to fit a textarea in it
						clipboardTextElem.value = encodedStr; //add the encoded string to the textarea
						document.body.appendChild(clipboardTextElem); //add the textarea to the document
						clipboardTextElem.select(); //focus the textarea?
						clipboardTextElem.setSelectionRange(0, 99999); //select all of the text in the textarea
						document.execCommand('copy'); //finally send the copy command
						document.body.removeChild(clipboardTextElem); //get rid of the evidence
					} //end of onClick function
				}) //end of react createElement
			); //end of profileBannerButton element push
		}); //end of patched function
	} //End of bannerUrlEncoding()

	appIcons() {
		settings.changePremiumType = true; //Forcibly enable premiumType. Couldn't find a workaround, sry.

		try {
			if (!(ORIGINAL_NITRO_STATUS > 1)) {
				CurrentUser.premiumType = 1;
				setTimeout(() => {
					if (settings.changePremiumType) {
						CurrentUser.premiumType = 1;
					}
				}, 10000);
			}
		} catch (err) {
			Logger.error(this.meta.name, 'Error occurred changing premium type. ' + err);
		}

		if (this.appIconModule == undefined) this.appIconModule = Webpack.getByKeys('getCurrentDesktopIcon');
		delete this.appIconModule.isUpsellPreview;
		Object.defineProperty(this.appIconModule, 'isUpsellPreview', {
			value: false,
			configurable: true,
			enumerable: true,
			writable: true
		});

		delete this.appIconModule.isEditorOpen;
		Object.defineProperty(this.appIconModule, 'isEditorOpen', {
			value: false,
			configurable: true,
			enumerable: true,
			writable: true
		});

		if (this.appIconButtonsModule == undefined) this.appIconButtonsModule = Webpack.getAllByKeys('Z').filter((obj) => obj.Z.toString().includes('renderCTAButtons'))[0];
		Patcher.before(this.meta.name, this.appIconButtonsModule, 'Z', (_, args) => {
			args[0].disabled = false; //force buttons clickable
		});
	}

	parseMeta(fileContent) {
		//zlibrary code
		const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
		const escapedAtRegex = /^\\@/;
		const block = fileContent.split('/**', 2)[1].split('*/', 1)[0];
		const out = {};
		let field = '';
		let accum = '';
		for (const line of block.split(splitRegex)) {
			if (line.length === 0) continue;
			if (line.charAt(0) === '@' && line.charAt(1) !== ' ') {
				out[field] = accum;
				const l = line.indexOf(' ');
				field = line.substring(1, l);
				accum = line.substring(l + 1);
			} else {
				accum += ' ' + line.replace('\\n', '\n').replace(escapedAtRegex, '@');
			}
		}
		out[field] = accum.trim();
		delete out[''];
		out.format = 'jsdoc';
		return out;
	}

	async checkForUpdate() {
		try {
			let fileContent = await (await fetch(this.meta.updateUrl)).text();
			let remoteMeta = this.parseMeta(fileContent);
			let remoteVersion = remoteMeta.version.trim().split('.');
			let currentVersion = this.meta.version.trim().split('.');

			if (parseInt(remoteVersion[0]) > parseInt(currentVersion[0])) {
				this.newUpdateNotify(remoteMeta, fileContent);
			} else if (remoteVersion[0] == currentVersion[0] && parseInt(remoteVersion[1]) > parseInt(currentVersion[1])) {
				this.newUpdateNotify(remoteMeta, fileContent);
			} else if (remoteVersion[0] == currentVersion[0] && remoteVersion[1] == currentVersion[1] && parseInt(remoteVersion[2]) > parseInt(currentVersion[2])) {
				this.newUpdateNotify(remoteMeta, fileContent);
			}
		} catch (err) {
			Logger.error(this.meta.name, err);
		}
	}

	newUpdateNotify(remoteMeta, remoteFile) {
		Logger.info(this.meta.name, 'A new update is available!');

		UI.showConfirmationModal('Update Available', [`Update ${remoteMeta.version} is now available for YABDP4Nitro!`, 'Press Download Now to update!'], {
			confirmText: 'Download Now',
			onConfirm: async (e) => {
				if (remoteFile) {
					await new Promise((r) => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, `${this.meta.name}.plugin.js`), remoteFile, r));
					let currentVersionInfo = Data.load(this.meta.name, 'currentVersionInfo');
					currentVersionInfo.hasShownChangelog = false;
					Data.save(this.meta.name, 'currentVersionInfo', currentVersionInfo);
				}
			}
		});
	}

	start() {
		Logger.info(this.meta.name, '(v' + this.meta.version + ') has started.');

		//update check
		try {
			let currentVersionInfo = Object.assign({}, { version: this.meta.version, hasShownChangelog: false }, Data.load('YABDP4Nitro', 'currentVersionInfo'));
			currentVersionInfo.version = this.meta.version;
			Data.save(this.meta.name, 'currentVersionInfo', currentVersionInfo);

			if (settings.checkForUpdates) this.checkForUpdate();

			if (!currentVersionInfo.hasShownChangelog) {
				UI.showChangelogModal({
					title: 'YABDP4Nitro Changelog',
					subtitle: config.changelog[0].title,
					changes: [
						{
							title: config.changelog[0].title,
							type: 'changed',
							items: config.changelog[0].items
						}
					]
				});
				currentVersionInfo.hasShownChangelog = true;
				Data.save(this.meta.name, 'currentVersionInfo', currentVersionInfo);
			}
		} catch (err) {
			Logger.error(this.meta.name, err);
		}

		this.saveAndUpdate();
	}

	stop() {
		CurrentUser.premiumType = ORIGINAL_NITRO_STATUS;
		Patcher.unpatchAll(this.meta.name);
		Dispatcher.unsubscribe('COLLECTIBLES_CATEGORIES_FETCH_SUCCESS', this.storeProductsFromCategories);
		if (document.getElementById('qualityButton')) document.getElementById('qualityButton').remove();
		if (document.getElementById('qualityMenu')) document.getElementById('qualityMenu').remove();
		if (document.getElementById('qualityInput')) document.getElementById('qualityInput').remove();
		if (document.getElementById('copy3y3button')) document.getElementById('copy3y3button').remove();
		if (document.getElementById('profileBannerButton')) document.getElementById('profileBannerButton').remove();
		if (document.getElementById('profileBannerUrlInput')) document.getElementById('profileBannerUrlInput').remove();
		if (document.getElementById('decorationButton')) document.getElementById('decorationButton').remove();
		if (document.getElementById('changeProfileEffectButton')) document.getElementById('changeProfileEffectButton').remove();
		if (document.getElementById('profilePictureUrlInput')) document.getElementById('profilePictureUrlInput').remove();
		if (document.getElementById('profilePictureButton')) document.getElementById('profilePictureButton').remove();
		BdApi.DOM.removeStyle(this.meta.name);
		BdApi.DOM.removeStyle('BDNitroBadges');
		BdApi.DOM.removeStyle('UsrBGIntegration');
		usrBgUsers = [];
		BdApi.unlinkJS('ffmpeg.js');
		Logger.info(this.meta.name, '(v' + this.meta.version + ') has stopped.');
	}
};
/*@end@*/
