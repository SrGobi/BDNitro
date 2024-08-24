/**
 * @name BDNitro
 * @author SrGobi
 * @version 5.4.6
 * @invite cqrN3Eg
 * @source https://github.com/srgobi/BDNitro
 * @updateUrl https://raw.githubusercontent.com/srgobi/BDNitro/main/BDNitro.plugin.js
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
const { Webpack } = BdApi;
const StreamButtons = Webpack.getByKeys("L9", "LY", "ND", "WC", "aW", "af");
const ApplicationStreamResolutions = StreamButtons.LY;
const ApplicationStreamSettingRequirements = StreamButtons.ND;
const ApplicationStreamResolutionButtons = StreamButtons.WC;
const ApplicationStreamFPSButtonsWithSuffixLabel = StreamButtons.af;
const ApplicationStreamFPSButtons = StreamButtons.k0;
const ApplicationStreamResolutionButtonsWithSuffixLabel = StreamButtons.km;
const ApplicationStreamFPS = StreamButtons.ws;
const CloudUploader = Webpack.getByKeys("m", "n").n;
const Uploader = Webpack.getByKeys("uploadFiles", "upload");
const CurrentUser = Webpack.getByKeys("getCurrentUser").getCurrentUser();
const ORIGINAL_NITRO_STATUS = CurrentUser.premiumType;
const getBannerURL = Webpack.getByPrototypeKeys("getBannerURL").prototype;
let usrBgUsers = [];
let badgeUserIDs = [];
let fetchedUserBg = false;
let fetchedUserPfp = false;
let downloadedUserProfiles = [];
const userProfileMod = Webpack.getByKeys("getUserProfile");
const buttonClassModule = Webpack.getByKeys("lookFilled", "button", "contents");
const Dispatcher = Webpack.getByKeys("subscribe", "dispatch");
const canUserUseMod = Webpack.getByKeys("canUserUse");
const AvatarDefaults = Webpack.getByKeys("getEmojiURL");
const LadderModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("calculateLadder"), { searchExports: true });
const FetchCollectibleCategories = BdApi.Webpack.getByKeys("B1", "DR", "F$", "K$").F$
//#endregion

module.exports = (() => {
	const config = {
		"info": {
			"name": "BDNitro",
			"authors": [{
				"name": "SrGobi",
				"discord_id": "359063827091816448",
				"github_username": "srgobi"
			}],
			"version": "5.4.5",
			"description": "¡Desbloquea todos los modos de compartir pantalla y usa gestos GIF y entre servidores!",
			"github": "https://github.com/srgobi/BDNitro",
			"github_raw": "https://raw.githubusercontent.com/srgobi/BDNitro/main/BDNitro.plugin.js"
		},
		changelog: [
			{
				title: "5.4.5",
				items: [
					"Se modificó la implementación de UsrBg para que esté más cerca de la implementación original.",
					"Se simplificó algún código relacionado con los estilos.",
					"Se corrigieron los temas de gradiente que se eliminan después de la recarga."
				]
			}
		],
		"main": "BDNitro.plugin.js"
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() {
			this._config = config;
		}
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return config.info.description;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			BdApi.UI.showConfirmationModal("Falta la biblioteca", `Falta el complemento de biblioteca necesario para ${config.info.name}. Haga clic en Descargar ahora para instalarlo.`, {
				confirmText: "Descargar ahora",
				cancelText: "Cancelar",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
						if (error) return require("electron").shell.openExternal("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const {
				DiscordModules,
				Settings,
				Toasts,
				Utilities,
				DiscordClassModules,
				PluginUpdater,
				Logger
			} = Api;

			return class BDNitro extends Plugin {
				defaultSettings = {
					DISCORD_CERTIFIED_MODERATOR: false,
					HYPESQUAD_EVENTS: false,
					HOUSE_BRILLIANCE: false,
					HOUSE_BRAVERY: false,
					HOUSE_BALANCE: false,
					BUGHUNTER_LEVEL_1: false,
					EARLY_VERIFIED_BOT_DEVELOPER: false,
					NITRO: false,
					"emojiSize": 64,
					"screenSharing": true,
					"emojiBypass": true,
					"ghostMode": false,
					"emojiBypassForValidEmoji": true,
					"PNGemote": true,
					"uploadEmotes": true,
					"uploadStickers": false,
					"CustomFPSEnabled": false,
					"CustomFPS": 60,
					"ResolutionEnabled": false,
					"CustomResolution": 1440,
					"CustomBitrateEnabled": false,
					"minBitrate": -1,
					"maxBitrate": -1,
					"targetBitrate": -1,
					"voiceBitrate": 128,
					"ResolutionSwapper": false,
					"stickerBypass": false,
					"profileV2": false,
					"forceStickersUnlocked": false,
					"changePremiumType": false,
					"videoCodec": 0,
					"clientThemes": true,
					"lastGradientSettingStore": -1,
					"fakeProfileThemes": true,
					"removeProfileUpsell": false,
					"removeScreenshareUpsell": true,
					"fakeProfileBanners": true,
					"fakeAvatarDecorations": true,
					"unlockAppIcons": false,
					"profileEffects": true,
					"killProfileEffects": false,
					"avatarDecorations": {},
					"customPFPs": true,
					"experiments": false,
					"userPfpIntegration": true,
					"userBgIntegration": true
				};
				settings = Utilities.loadSettings(this.getName(), this.defaultSettings);
				getSettingsPanel() {
					return Settings.SettingPanel.build(_ => this.saveAndUpdate(), ...[
						new Settings.SettingGroup("Badges").append(...[
							new Settings.Switch("Moderador Certificado", "Desbloquea el badge de exalumnos de la academia de moderadores", this.settings.DISCORD_CERTIFIED_MODERATOR, value => this.settings.DISCORD_CERTIFIED_MODERATOR = value),
							new Settings.Switch("Eventos del HypeSquad", "Desbloquea el badge de eventos del HypeSquad", this.settings.HYPESQUAD_EVENTS, value => this.settings.HYPESQUAD_EVENTS = value),
							new Settings.Switch("House Brilliance", "Desbloquea el badge de contribuidor", this.settings.HOUSE_BRILLIANCE, value => this.settings.HOUSE_BRILLIANCE = value),
							new Settings.Switch("House Bravery", "Desbloquea el badge de contribuidor", this.settings.HOUSE_BRAVERY, value => this.settings.HOUSE_BRAVERY = value),
							new Settings.Switch("House Balance", "Desbloquea el badge de contribuidor", this.settings.HOUSE_BALANCE, value => this.settings.HOUSE_BALANCE = value),
							new Settings.Switch("Bug Hunter", "Desbloquea el badge de cazador de bugs", this.settings.BUGHUNTER_LEVEL_1, value => this.settings.BUGHUNTER_LEVEL_1 = value),
							new Settings.Switch("Early Bot Developer", "Desbloquea el badge de desarrollador de bots temprano", this.settings.EARLY_VERIFIED_BOT_DEVELOPER, value => this.settings.EARLY_VERIFIED_BOT_DEVELOPER = value),
							new Settings.Switch("Nitro", "Desbloquea el badge de Nitro", this.settings.NITRO, value => this.settings.NITRO = value),
						]),
						new Settings.SettingGroup("Funciones para compartir pantalla").append(...[
							new Settings.Switch("Compartir pantalla de alta calidad", "Compartir pantalla 1080p/Fuente a 60 fps. Habilítelo si desea utilizar alguna opción relacionada con Compartir pantalla.", this.settings.screenSharing, value => this.settings.screenSharing = value),
							new Settings.Switch("Resolución de pantalla compartida personalizada", "¡Elija su propia resolución de pantalla compartida!", this.settings.ResolutionEnabled, value => this.settings.ResolutionEnabled = value),
							new Settings.Textbox("Resolución", "La resolución personalizada que desees (en píxeles)", this.settings.CustomResolution,
								value => {
									value = parseInt(value, 10);
									this.settings.CustomResolution = value;
								}),
							new Settings.Switch("FPS compartido de pantalla personalizado", "¡Elige tu propio FPS compartido de pantalla!", this.settings.CustomFPSEnabled, value => this.settings.CustomFPSEnabled = value),
							new Settings.Textbox("FPS", "", this.settings.CustomFPS,
								value => {
									value = parseInt(value);
									this.settings.CustomFPS = value;
								}),
							new Settings.Switch("Stream Settings Quick Swapper", "¡Agrega un botón que te permitirá cambiar tu resolución rápidamente!", this.settings.ResolutionSwapper, value => this.settings.ResolutionSwapper = value),
							new Settings.Switch("Tasa de bits personalizada", "¡Elija la tasa de bits para sus transmisiones!", this.settings.CustomBitrateEnabled, value => this.settings.CustomBitrateEnabled = value),
							new Settings.Textbox("Velocidad de bits mínima", "La velocidad de bits mínima (en kbps). Si se establece en un número negativo, se utilizará el valor predeterminado de Discord de 150 kbps.", this.settings.minBitrate,
								value => {
									value = parseFloat(value);
									this.settings.minBitrate = value;
								}),
							new Settings.Textbox("Velocidad de bits máxima", "La velocidad de bits máxima (en kbps). Si se establece en un número negativo, se utilizará el valor predeterminado de Discord de 600 kbps.", this.settings.maxBitrate,
								value => {
									value = parseFloat(value);
									this.settings.maxBitrate = value;
								}),
							new Settings.Textbox("Velocidad de bits objetivo", "La velocidad de bits objetivo (en kbps). Si se establece en un número negativo, se utilizará el valor predeterminado de Discord de 2500 kbps.", this.settings.targetBitrate,
								value => {
									value = parseFloat(value);
									this.settings.targetBitrate = value;
								}),
							new Settings.Textbox("Voz Audio Bitrate", "Le permite cambiar la velocidad de bits de voz a lo que desee. No le permite superar la velocidad de bits establecida del canal de voz, pero sí le permite bajar mucho más (tasa de bits en kbps).", this.settings.voiceBitrate,
								value => {
									value = parseFloat(value);
									this.settings.voiceBitrate = value;
								}),
							new Settings.Dropdown("Códec de vídeo preferido", "Cambia el códec de vídeo para compartir pantalla al establecido.", this.settings.videoCodec, [
								{ label: "Default/Disabled", value: 0 },
								{ label: "H.265", value: 1 },
								{ label: "H.264", value: 2 },
								{ label: "VP8", value: 3 },
								{ label: "VP9", value: 4 }], value => this.settings.videoCodec = value, { searchable: true }
							)
						]),
						new Settings.SettingGroup("Emojis").append(
							new Settings.Switch("Nitro Emotes Bypass", "Habilitar o deshabilitar el uso de la omisión de emoji.", this.settings.emojiBypass, value => this.settings.emojiBypass = value),
							new Settings.Dropdown("Tamaño", "El tamaño del emoji en píxeles.", this.settings.emojiSize, [
								{ label: "32px (Default small/inline)", value: 32 },
								{ label: "48px (Recommended, default large)", value: 48 },
								{ label: "16px", value: 16 },
								{ label: "24px", value: 24 },
								{ label: "40px", value: 40 },
								{ label: "56px", value: 56 },
								{ label: "64px", value: 64 },
								{ label: "80px", value: 80 },
								{ label: "96px", value: 96 },
								{ label: "128px (Max emoji size)", value: 128 },
								{ label: "256px (Max GIF emoji size)", value: 256 }
							],
								value => {
									if (isNaN(value)) {
										value = 48;
									}
									this.settings.emojiSize = value
								}, { searchable: true }
							),
							new Settings.Switch("Modo fantasma", "Abusa del error de mensaje fantasma para ocultar la URL del emoji.", this.settings.ghostMode, value => this.settings.ghostMode = value),
							new Settings.Switch("No use la omisión de emoji si el gesto está desbloqueado", "Desactive para usar la omisión de emoji incluso si no es necesario omitir para ese emoji.", this.settings.emojiBypassForValidEmoji, value => this.settings.emojiBypassForValidEmoji = value),
							new Settings.Switch("Utilice PNG en lugar de WEBP", "¡Utilice la versión PNG de emoji para obtener mayor calidad!", this.settings.PNGemote, value => this.settings.PNGemote = value),
							new Settings.Switch("Cargar gestos como imágenes", "Cargar gestos como imágenes después de enviar el mensaje. (Anula la vinculación de gestos)", this.settings.uploadEmotes, value => this.settings.uploadEmotes = value),
							new Settings.Switch("Sticker Bypass", "Habilita o deshabilita el uso de la omisión de stickers. Recomiendo usar DiscordFreeStickers de An00nymushun sobre esto. Los stickers animados APNG/WEBP/Lottie no se animarán.", this.settings.stickerBypass, value => this.settings.stickerBypass = value),
							new Settings.Switch("Subir stickers", "Subir stickers de la misma manera que los emoticonos.", this.settings.uploadStickers, value => this.settings.uploadStickers = value),
							new Settings.Switch("Forzar el desbloqueo de stickers", "Habilitar para que se desbloqueen los stickers.", this.settings.forceStickersUnlocked, value => this.settings.forceStickersUnlocked = value)
						),
						new Settings.SettingGroup("Perfil").append(
							new Settings.Switch("Acentos de perfil", "Cuando está habilitado, verá (casi) todos los usuarios con el nuevo aspecto exclusivo de Nitro para los perfiles (el aspecto más sexy). Cuando está deshabilitado, se utiliza el comportamiento predeterminado. No le permite actualizar el acento de su perfil.", this.settings.profileV2, value => this.settings.profileV2 = value),
							new Settings.Switch("Temas de perfiles falsos", "Utiliza codificación invisible 3y3 para permitir temas de perfil ocultando los colores en tu biografía.", this.settings.fakeProfileThemes, value => this.settings.fakeProfileThemes = value),
							new Settings.Switch("Banners de perfil falsos", "Utiliza codificación invisible 3y3 para permitir configurar banners de perfil ocultando la URL de la imagen en su biografía. Solo admite URL de Imgur por razones de seguridad.", this.settings.fakeProfileBanners, value => this.settings.fakeProfileBanners = value),
							new Settings.Switch("Integración de UserBG", "Descarga y analiza la base de datos JSON de UserBG para que aparezcan los banners de UserBG.", this.settings.userBgIntegration, value => this.settings.userBgIntegration = value),
							new Settings.Switch("Decoraciones de avatar falsas", "Utiliza codificación invisible 3y3 para permitir configurar decoraciones de avatar ocultando información en su biografía y/o su estado personalizado.", this.settings.fakeAvatarDecorations, value => this.settings.fakeAvatarDecorations = value),
							new Settings.Switch("Efectos de perfil falsos", "Utiliza codificación invisible 3y3 para permitir configurar efectos de perfil ocultando información en su biografía.", this.settings.profileEffects, value => this.settings.profileEffects = value),
							new Settings.Switch("Eliminar efectos de perfil", "¿Odias los efectos de perfil? Habilítalo y desaparecerán. Todos. Anula todos los efectos de perfil.", this.settings.killProfileEffects, value => this.settings.killProfileEffects = value),
							new Settings.Switch("Imágenes de perfil falsas", "Utiliza codificación invisible 3y3 para permitir configurar imágenes de perfil personalizadas ocultando la URL de una imagen EN SU ESTADO PERSONALIZADO. Solo admite URL de Imgur por razones de seguridad.", this.settings.customPFPs, value => this.settings.customPFPs = value),
							new Settings.Switch("Integración UserPFP", "Importa la base de datos UserPFP para que las personas que tienen imágenes de perfil en la base de datos UserPFP aparezcan con su imagen de perfil UserPFP. Hay pocas razones para desactivar esto.", this.settings.userPfpIntegration, value => this.settings.userPfpIntegration = value)
						),
						new Settings.SettingGroup("Misceláneos").append(
							new Settings.Switch("Cambiar PremiumType", "Esto ahora es opcional. Habilitar esto puede ayudar a la compatibilidad con ciertas cosas o dañarla. SimpleDiscordCrypt requiere que esto esté habilitado para que funcione la omisión de emoji. Habilítelo solo si no tiene Nitro.", this.settings.changePremiumType, value => this.settings.changePremiumType = value),
							new Settings.Switch("Temas de cliente degradados", "Le permite utilizar temas de cliente exclusivos de Nitro.", this.settings.clientThemes, value => this.settings.clientThemes = value),
							new Settings.Switch("Eliminar venta adicional de personalización del perfil", "Elimina la venta adicional \"Pruébalo\" en la pantalla de personalización del perfil y la reemplaza con la variante Nitro. Nota: no le permite usar la personalización de Nitro en perfiles de servidor ya que la API no lo permite.", this.settings.removeProfileUpsell, value => this.settings.removeProfileUpsell = value),
							new Settings.Switch("Eliminar venta adicional de Screen Share Nitro", "Elimina la venta adicional de Nitro en el menú de opciones de calidad de Screen Share.", this.settings.removeScreenshareUpsell, value => this.settings.removeScreenshareUpsell = value),
							new Settings.Switch("Iconos de aplicaciones", "Desbloquea los iconos de aplicaciones. Advertencia: habilitar esto forzará la activación de \"Cambiar tipo premium\". Error.", this.settings.unlockAppIcons, value => this.settings.unlockAppIcons = value),
							new Settings.Switch("Experimentos", "Desbloquea experimentos. Úsalo bajo tu propia responsabilidad.", this.settings.experiments, value => this.settings.experiments = value)
						)
					])
				}


				saveAndUpdate() { //Guarda y actualiza configuraciones y ejecuta funciones.
					Utilities.saveSettings(this.getName(), this.settings);
					BdApi.Patcher.unpatchAll(this.getName());

					BdApi.DOM.removeStyle(this.getName());
					BdApi.DOM.removeStyle("BDNitroBadges");
					BdApi.DOM.removeStyle("UsrBGIntegration");

					if (this.settings.changePremiumType) {
						try {
							if (!(ORIGINAL_NITRO_STATUS > 1)) {
								CurrentUser.premiumType = 1;
								setTimeout(() => {
									if (this.settings.changePremiumType) {
										CurrentUser.premiumType = 1;
									}
								}, 10000);
							}
						}
						catch (err) {
							Logger.err(this.getName(), "Se produjo un error al cambiar el tipo de prima." + err);
						}
					}

					if (this.settings.CustomFPS == 15) this.settings.CustomFPS = 16;
					if (this.settings.CustomFPS == 30) this.settings.CustomFPS = 31;
					if (this.settings.CustomFPS == 5) this.settings.CustomFPS = 6;

					if (document.getElementById("qualityButton")) document.getElementById("qualityButton").remove();
					if (document.getElementById("qualityMenu")) document.getElementById("qualityMenu").remove();
					if (document.getElementById("qualityInput")) document.getElementById("qualityInput").remove();

					if (this.settings.ResolutionSwapper) {
						try {
							this.buttonCreate(); //Botón y menú de calidad rápida
						} catch (err) {
							console.error(err);
						}
						try {
							document.getElementById("qualityInput").addEventListener("input", this.updateQuick);
							document.getElementById("qualityInputFPS").addEventListener("input", this.updateQuick);
							if (!this.settings.ResolutionSwapper) {
								if (document.getElementById("qualityButton") != undefined) document.getElementById("qualityButton").style.display = 'none';
								if (document.getElementById("qualityMenu") != undefined) document.getElementById("qualityMenu").style.display = 'none';
							}
						} catch (err) {
							console.error(err);
						}
					}


					if (this.settings.stickerBypass) {
						try {
							this.stickerSending()
						} catch (err) {
							console.error(err)
						}
					}

					if (this.settings.emojiBypass) {
						try {
							this.emojiBypass();

							if (this.emojiMods == undefined) this.emojiMods = Webpack.getByKeys("isEmojiFilteredOrLocked");

							BdApi.Patcher.instead(this.getName(), this.emojiMods, "isEmojiFilteredOrLocked", () => {
								return false;
							});
							BdApi.Patcher.instead(this.getName(), this.emojiMods, "isEmojiDisabled", () => {
								return false;
							});
							BdApi.Patcher.instead(this.getName(), this.emojiMods, "isEmojiFiltered", () => {
								return false;
							});
							BdApi.Patcher.instead(this.getName(), this.emojiMods, "isEmojiPremiumLocked", () => {
								return false;
							});
							BdApi.Patcher.instead(this.getName(), this.emojiMods, "getEmojiUnavailableReason", () => {
								return;
							});

						} catch (err) {
							console.error(err);
						}
					}

					if (this.settings.profileV2) {
						try {
							BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, args, ret) => {
								if (ret == undefined) return;
								ret.premiumType = 2;
							});
						} catch (err) {
							console.error(err);
						}
					}

					if (this.settings.screenSharing) {
						try {
							this.customVideoSettings(); //Desbloquee botones de transmisión, aplique resolución y fps personalizados y aplique omisiones de calidad de transmisión
						} catch (err) {
							Logger.err(this.getName(), "Se produjo un error durante customVideoSettings()" + err);
						}
						try {
							this.videoQualityModule(); //Velocidad de bits personalizada, fps, módulo de resolución
						} catch (err) {
							Logger.err(this.getName(), "Se produjo un error durante videoQualityModule()" + err);
						}
					}

					if (this.settings.forceStickersUnlocked) {
						if (this.stickerSendabilityModule == undefined) this.stickerSendabilityModule = Webpack.getByKeys("cO", "eb", "kl");
						//getStickerSendability
						BdApi.Patcher.instead(this.getName(), this.stickerSendabilityModule, "cO", () => {
							return 0;
						});
						//isSendableSticker
						BdApi.Patcher.instead(this.getName(), this.stickerSendabilityModule, "kl", () => {
							return true;
						});
					}

					if (this.settings.clientThemes) {
						try {
							this.clientThemes();
						} catch (err) {
							console.warn("[BDNitro] " + err);
						}
					}

					if (this.settings.fakeProfileThemes) {
						try {
							this.decodeAndApplyProfileColors();
							this.encodeProfileColors();
						} catch (err) {
							Logger.err(this.getName(), "Se produjo un error al ejecutar la omisión de fakeProfileThemes." + err);
						}

					}

					if (this.settings.removeScreenshareUpsell) {
						try {
							BdApi.DOM.addStyle(this.getName(), `
							[class*="upsellBanner"] {
							  display: none;
							  visibility: hidden;
							}`);
						} catch (err) {
							Logger.err(this.getName(), err);
						}
					}

					if (this.settings.fakeProfileBanners) {
						this.bannerUrlDecoding();
						this.bannerUrlEncoding(this.secondsightifyEncodeOnly);
						if (this.settings.userBgIntegration) {
							BdApi.DOM.addStyle("UsrBGIntegration", `
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
							)
						}
					}

					Dispatcher.unsubscribe("COLLECTIBLES_CATEGORIES_FETCH_SUCCESS", this.storeProductsFromCategories);

					if (this.settings.fakeAvatarDecorations) {
						this.fakeAvatarDecorations();
					}

					if (this.settings.unlockAppIcons) {
						this.appIcons();
					}

					if (this.settings.profileEffects) {
						try {
							this.profileFX(this.secondsightifyEncodeOnly);
						} catch (err) {
							console.error(err);
						}
					}

					if (this.settings.killProfileEffects) {
						try {
							this.killProfileFX();
						} catch (err) {
							Logger.err(this.getName(), "Error occured during killProfileFX() " + err);
						}
					}

					try {
						this.LoadingBadges();
					} catch (err) {
						Logger.err(this.getName(), "Se produjo un error durante LoadingBadges() " + err);
					}

					if (this.settings.customPFPs) {
						try {
							this.customProfilePictureDecoding();
							this.customProfilePictureEncoding(this.secondsightifyEncodeOnly);
						} catch (err) {
							Logger.err(this.getName(), "Se produjo un error durante la decodificación/codificación de customProfilePicture." + err);
						}
					}

					if (this.settings.experiments) {
						try {
							this.experiments();
						} catch (err) {
							Logger.err(this.getName(), "Se produjo un error en los experimentos()" + err);
						}
					}

					BdApi.Patcher.instead(this.getName(), canUserUseMod, "canUserUse", (_, [feature, user], originalFunction) => {

						if (this.settings.emojiBypass && (feature.name == "emojisEverywhere" || feature.name == "animatedEmojis")) {
							return true;
						}

						if (this.settings.appIcons && feature.name == 'appIcons') {
							return true;
						}

						if (this.settings.removeProfileUpsell && feature.name == 'profilePremiumFeatures') {
							return true;
						}

						if (this.settings.clientThemes && feature.name == 'clientThemes') {
							return true;
						}

						return originalFunction(feature, user);
					});
				} //End of saveAndUpdate()


				experiments() {
					if (this.hasAppliedExperiments) return;
					//Código gentilmente robado de https://gist.github.com/MeguminSama/2cae24c9e4c335c661fa94e72235d4c4?permalink_comment_id=4952988#gistcomment-4952988
					try {
						let _, a = Object.values,
							b = "getCurrentUser",
							c = "actionHandler",
							d = "_actionHandlers",
							l = "_dispatcher",
							i = "ExperimentStore";
						webpackChunkdiscord_app.push([
							[Date.now()], {},
							e => {
								_ = e
							}
						]), m = a((u = a(_.c).find(e => e?.exports?.default?.[b] && e?.exports?.default?.[l]?.[d]).exports.default)[l][d]._dependencyGraph.nodes), u[b]().flags |= 1, m.find(e => "Developer" + i == e.name)[c].CONNECTION_OPEN();
						try {
							m.find(e => i == e.name)[c].OVERLAY_INITIALIZE({
								user: {
									flags: 1
								}
							})
						} catch { }
						m.find(e => i == e.name).storeDidChange()
					} catch (err) {
						//console.warn(err);
					}

				}


				clientThemes() {
					if (this.clientThemesModule == undefined) this.clientThemesModule = Webpack.getModule(Webpack.Filters.byProps("isPreview"));

					//Eliminar la propiedad isPreview para que podamos configurar la nuestra
					delete this.clientThemesModule.isPreview;

					//Esta propiedad básicamente desbloquea los botones del tema del cliente
					Object.defineProperty(this.clientThemesModule, "isPreview", { //Habilitar la configuración del tema nitro
						value: false,
						configurable: true,
						enumerable: true,
						writable: true,
					});

					if (this.themesModule == undefined) this.themesModule = Webpack.getByKeys("V1", "ZI")

					if (this.gradientSettingModule == undefined) this.gradientSettingModule = Webpack.getByKeys("kj", "zO");
					const resetPreviewClientTheme = this.gradientSettingModule.kj;
					const updateBackgroundGradientPreset = this.gradientSettingModule.zO;

					//Parcheando la función saveClientTheme.
					BdApi.Patcher.instead(this.getName(), this.themesModule, "ZI", (_, [args]) => {
						if (args.backgroundGradientPresetId == undefined) {

							//Si este número es -1, eso le indica al complemento que el tema actual que estamos configurando no es un tema nitro degradado.
							this.settings.lastGradientSettingStore = -1;
							//Guardar cualquier cambio en la configuración
							Utilities.saveSettings(this.getName(), this.settings);

							//si el usuario intenta configurar el tema en el tema oscuro predeterminado
							if (args.theme == 'dark') {
								//Actualización de la configuración de envío para cambiar al tema oscuro.
								Dispatcher.dispatch({
									type: "SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE",
									changes: {
										appearance: {
											shouldSync: false,
											settings: {
												theme: 'dark', //default dark theme
												developerMode: true //Realmente no tengo idea de lo que esto hace.
											}
										}
									}
								})
								//deshazte de la temática gradiente.
								resetPreviewClientTheme();
								return;
							}

							//si el usuario está intentando configurar el tema en el tema claro predeterminado
							if (args.theme == 'light') {
								//enviar evento de actualización de configuración para cambiar al tema claro
								Dispatcher.dispatch({
									type: "SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE",
									changes: {
										appearance: {
											shouldSync: false,  //evitar la sincronización para evitar que la API de Discord entre
											settings: {
												theme: 'light', //default light theme
												developerMode: true
											}
										}
									}
								})
							}
							return;
						} else { //gradient themes
							//Almacene la última configuración de degradado utilizada en la configuración
							this.settings.lastGradientSettingStore = args.backgroundGradientPresetId;
							//guardar cualquier cambio en la configuración
							Utilities.saveSettings(this.getName(), this.settings);

							//enviar evento de actualización de configuración para cambiar al gradiente que eligió el usuario
							Dispatcher.dispatch({
								type: "SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE",
								changes: {
									appearance: {
										shouldSync: false,  //evitar la sincronización para evitar que la API de Discord entre
										settings: {
											theme: args.theme, //Los temas degradados se basan en oscuros o claros, args.theme almacena esta información
											clientThemeSettings: {
												backgroundGradientPresetId: args.backgroundGradientPresetId //ID preestablecido para el tema degradado
											},
											developerMode: true
										}
									}
								}
							});

							//actualice el degradado de fondo preestablecido al que acaba de elegir.
							updateBackgroundGradientPreset(this.settings.lastGradientSettingStore);
						}
					}); //Fin del parche saveClientTheme.


					//Si la última elección de apariencia fuera un tema de cliente nitro
					if (this.settings.lastGradientSettingStore != -1) {

						//Esta línea establece el gradiente al guardar y cargar el complemento.
						updateBackgroundGradientPreset(this.settings.lastGradientSettingStore);
					}

					if (this.accountSwitchModule == undefined) this.accountSwitchModule = Webpack.getByKeys("startSession");

					//parche de inicio de sesión. Esta función se ejecuta al cambiar de cuenta.
					BdApi.Patcher.after(this.getName(), this.accountSwitchModule, "startSession", () => {

						//Si la última elección de apariencia fuera un tema de cliente nitro
						if (this.settings.lastGradientSettingStore != -1) {
							//Restaurar gradiente al cambiar de cuenta
							updateBackgroundGradientPreset(this.settings.lastGradientSettingStore);
						}
					});
				} //Fin de clientThemes()


				customProfilePictureDecoding() {
					if (this.getAvatarUrlModule == undefined) this.getAvatarUrlModule = Webpack.getByPrototypeKeys("getAvatarURL").prototype;

					BdApi.Patcher.instead(this.getName(), this.getAvatarUrlModule, "getAvatarURL", (user, [userId, size, shouldAnimate], originalFunction) => {

						//integración más cercana de userpfp
						//si aún no hemos obtenido la base de datos userPFP y está habilitada
						if ((!fetchedUserPfp || this.userPfps == undefined) && this.settings.userPfpIntegration) {

							const userPfpJsonUrl = "https://raw.githubusercontent.com/UserPFP/UserPFP/main/source/data.json";

							// descargar datos de usuarioPfp
							BdApi.Net.fetch(userPfpJsonUrl)
								// parse as json
								.then(res => res.json())
								// store res.avatars in this.userPfps
								.then(res => this.userPfps = res.avatars);
							//establezca el indicador fetchedUserPfp en verdadero.
							fetchedUserPfp = true;

						}

						//si la base de datos userPfp no está definida, se ha recuperado y está habilitada
						if ((this.userPfps != undefined && fetchedUserPfp) && this.settings.userPfpIntegration) {
							//y este usuario está en la base de datos userPfp,
							if (this.userPfps[user.id] != undefined) {
								//devolver la URL de la imagen de perfil de UserPFP.
								return this.userPfps[user.id];
							}
						}


						if (DiscordModules.UserStatusStore.getActivities(user.id).length > 0) {
							//obtener actividades del usuario
							let activities = DiscordModules.UserStatusStore.getActivities(user.id);
							//si el usuario no tiene un estado personalizado, devuelve la función original.
							if (activities[0].name != "Custom Status") return originalFunction(userId, size, shouldAnimate);

							//Si el usuario tiene un estado personalizado, asígnelo a la variable customStatus.
							let customStatus = activities[0].state;
							//comprobando si algo salió mal
							if (customStatus == undefined) return originalFunction(userId, size, shouldAnimate);
							//decodificar cualquier texto 3y3
							let revealedText = this.secondsightifyRevealOnly(String(customStatus));
							//si no hay texto codificado 3y3, devuelve la función original.
							if (revealedText == undefined) return originalFunction(userId, size, shouldAnimate);

							//Esta expresión regular coincide con /P{*} . (No jodas con esto)
							let regex = /P\{[^}]*\}/;

							//Compruebe si hay coincidencias en el estado personalizado.
							let matches = revealedText.toString().match(regex);
							//si no, devuelve la función original
							if (matches == undefined) return originalFunction(userId, size, shouldAnimate);
							if (matches == "") return originalFunction(userId, size, shouldAnimate);

							//si hay una coincidencia, tome la primera coincidencia y elimine la "P{ inicial y la final "}"
							let matchedText = matches[0].replace("P{", "").replace("}", "");

							//busque una extensión de archivo. Si se omite, recurra a .gif.
							if (!String(matchedText).endsWith(".gif") && !String(matchedText).endsWith(".png") && !String(matchedText).endsWith(".jpg") && !String(matchedText).endsWith(".jpeg") && !String(matchedText).endsWith(".webp")) {
								matchedText += ".gif"; //No se detectó ninguna extensión de archivo compatible. Recurrir a una extensión de archivo predeterminada.
							}

							//agregue este usuario a la lista de usuarios que tienen la insignia de usuario de BDNitro si aún no los hemos agregado.
							if (!badgeUserIDs.includes(user.id)) badgeUserIDs.push(user.id);

							//return imgur url
							return `https://i.imgur.com/${matchedText}`;
						}

						//Si el usuario no tiene ninguna actividad activa, devuelve la función original.
						return originalFunction(userId, size, shouldAnimate);
					})
				}


				//Botones de personalización de perfil PFP personalizados y código de codificación.
				async customProfilePictureEncoding(secondsightifyEncodeOnly) {

					//espere a que se cargue el renderizador de la sección de personalización de avatar
					await Webpack.waitForModule(Webpack.Filters.byStrings("USER_SETTINGS_RESET_AVATAR"));
					//módulo de renderizado de la sección de personalización de avatar de la tienda
					if (this.customPFPSettingsRenderMod == undefined) this.customPFPSettingsRenderMod = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("USER_SETTINGS_RESET_AVATAR"))[0];

					BdApi.Patcher.after(this.getName(), this.customPFPSettingsRenderMod, "Z", (_, [args], ret) => {

						//No es necesario hacer nada si este es el flujo "Probar Nitro".
						if (args.isTryItOutFlow) return;

						ret.props.children.props.children.push(
							BdApi.React.createElement("input", {
								id: "profilePictureUrlInput",
								style: {
									width: "30%",
									height: "20%",
									maxHeight: "50%",
									marginTop: "5px",
									marginLeft: "5px"
								},
								placeholder: "Imgur URL"
							})
						);

						//Crear y agregar el botón Copiar PFP 3y3.
						ret.props.children.props.children.push(
							BdApi.React.createElement("button", {
								children: "Copy PFP 3y3",
								className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
								id: "profilePictureButton",
								style: {
									marginLeft: "10px",
									whiteSpace: "nowrap"
								},
								onClick: async function () { //en copiar pfp 3y3 haga clic en el botón

									//tomar texto del área de texto de entrada de URL de pfp.
									let profilePictureUrlInputValue = String(document.getElementById("profilePictureUrlInput").value);

									//vacío, saltar.
									if (profilePictureUrlInputValue == "") return;
									if (profilePictureUrlInputValue == undefined) return;

									//limpiar cadena para codificar
									let stringToEncode = "" + profilePictureUrlInputValue
										//limpiar URL
										.replace("http://", "") //remover protocolo
										.replace("https://", "")
										.replace("i.imgur.com", "imgur.com")

									let encodedStr = ""; //inicializar cadena codificada como cadena vacía
									stringToEncode = String(stringToEncode); //asegúrese doblemente de que stringToEncode sea una cadena

									//si la URL parece correcta
									if (stringToEncode.toLowerCase().startsWith("imgur.com")) {

										//Buscar URL del álbum o galería
										if (stringToEncode.replace("imgur.com/", "").startsWith("a/") || stringToEncode.replace("imgur.com/", "").startsWith("gallery/")) {
											//URL del álbum, lo que sigue es todo para obtener el enlace directo de la imagen, ya que la URL del álbum no es un enlace directo al archivo.

											//Obtener la página del álbum imgur
											try {
												const parser = new DOMParser();
												stringToEncode = await BdApi.Net.fetch(("https://" + stringToEncode), {
													method: "GET",
													mode: "cors"
												}).then(res => res.text()
													//parse html, queryselect meta tag with certain name
													.then(res => parser.parseFromString(res, "text/html").querySelector('[name="twitter:player"]').content));
												stringToEncode = stringToEncode.replace("http://", "") //get rid of protocol
													.replace("https://", "") //get rid of protocol
													.replace("i.imgur.com", "imgur.com")
													.replace(".jpg", "").replace(".jpeg", "").replace(".webp", "").replace(".png", "").replace(".mp4", "").replace(".webm", "").replace(".gifv", "").replace(".gif", "") //get rid of any file extension
													.split("?")[0]; //remove any URL parameters since we don't want or need them
											} catch (err) {
												ZLibrary.Logger.err("BDNitro", err);
												ZLibrary.Toasts.error("Se produjo un error. ¿Hay varias imágenes en este álbum/galería?");
												return;
											}
										}
										if (stringToEncode == "") {
											ZLibrary.Toasts.error("Se produjo un error: no se pudo encontrar el nombre del archivo.");
											ZLibrary.Logger.err("BDNitro", "No se pudo encontrar el nombre del archivo por algún motivo. Póngase en contacto con SrGobi.");
										}

										//add starting "P{" , remove "imgur.com/" , and add ending "}"
										stringToEncode = "P{" + stringToEncode.replace("imgur.com/", "") + "}"
										//finally encode the string, adding a space before it so nothing fucks up
										encodedStr = " " + secondsightifyEncodeOnly(stringToEncode);
										//let the user know what has happened
										Toasts.info("¡3y3 copiado al portapapeles!");

										//If this is not an Imgur URL, yell at the user.
									} else if (stringToEncode.toLowerCase().startsWith("imgur.com") == false) {
										Toasts.warning("¡Por favor usa Imgur!");
										return;
									}

									//if somehow none of the previous code ran, this is the last protection against an error. If this runs, something has probably gone horribly wrong.
									if (encodedStr == "") return;

									//Do this stupid shit that Chrome forces you to do to copy text to the clipboard.
									const clipboardTextElem = document.createElement("textarea"); //create a textarea
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


				//Aplicar badges customizados
				LoadingBadges() {

					// Uso de la insignia de usuario de BDNitro
					BdApi.DOM.addStyle("BDNitroBadges", `
						a[aria-label="A fellow BDNitro user!"] img {
							content: url("https://raw.githubusercontent.com/srgobi/srgobi.github.io/main/badge.png") !important;
						}
						
						div [aria-label="A fellow BDNitro user!"] > a > img {
							content: url("https://raw.githubusercontent.com/srgobi/srgobi.github.io/main/badge.png") !important;
						}
					`);

					//Parches de insignia de perfil de usuario
					BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, args, ret) => {
						//malas comprobaciones de datos
						if (ret == undefined) return;
						if (ret.userId == undefined) return;
						if (ret.badges == undefined) return;

						const badgesList = []; //lista de ID de credencial del usuario actualmente procesado

						for (let i = 0; i < ret.badges.length; i++) { //para cada una de las credenciales de usuario actualmente procesadas
							badgesList.push(ret.badges[i].id); //agregue cada una de las ID de insignia de este usuario a BadgesList
						}

						// Configura las insignias basadas en las configuraciones del plugin
						const badgeConfig = {};

						// Recorre las insignias seleccionadas por el usuario
						Object.keys(badgeConfig).forEach(badgeKey => {
							const badge = badgeConfig[badgeKey];

							// Si la insignia está disponible y aún no ha sido añadida al perfil del usuario
							if (badge && !badgesList.includes(badge.id)) {
								ret.badges.push(badge);
							}
						});

						//if list of users that should have yabdp_user badge includes current user, and they don't already have the badge applied,
						if (badgeUserIDs.includes(ret.userId) && !badgesList.includes("yabdp_user")) {
							ret.badges.push({
								id: "yabdp_user",
								icon: "2ba85e8026a8614b640c2837bcdfe21b",
								description: "¡Un compañero usuario de BDNitro!",
								link: "https://github.com/srgobi/BDNitro"
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de DISCORD_CERTIFIED_MODERATOR y tiene `true` en la configuración de la insignia del DISCORD_CERTIFIED_MODERATOR,
						if (badgeUserIDs.includes(ret.userId) && this.settings.DISCORD_CERTIFIED_MODERATOR && !badgesList.includes("DISCORD_CERTIFIED_MODERATOR")) {
							ret.badges.push({
								id: "DISCORD_CERTIFIED_MODERATOR",
								icon: "fee1624003e2fee35cb398e125dc479b",
								description: "Exalumnos de la academia de moderadores",
								link: "https://discord.com/safety"
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de HYPESQUAD_EVENTS y tiene `true` en la configuración de la insignia del HYPESQUAD_EVENTS,
						if (badgeUserIDs.includes(ret.userId) && this.settings.HYPESQUAD_EVENTS && !badgesList.includes("HYPESQUAD_EVENTS")) {
							ret.badges.push({
								id: "HYPESQUAD_EVENTS",
								icon: "bf01d1073931f921909045f3a39fd264",
								description: "HypeSquad Events",
								link: "https://support.discord.com/hc/en-us/articles/360035962891-Profile-Badges-101#h_01GM67K5EJ16ZHYZQ5MPRW3JT3"
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de HOUSE_BRILLIANCE y tiene `true` en la configuración de la insignia del HOUSE_BRILLIANCE,
						if (badgeUserIDs.includes(ret.userId) && this.settings.HOUSE_BRILLIANCE && !badgesList.includes("HOUSE_BRILLIANCE")) {
							ret.badges.push({
								id: "HOUSE_BRILLIANCE",
								icon: "011940fd013da3f7fb926e4a1cd2e618",
								description: "House of Brilliance",
								link: "https://support.discord.com/hc/en-us/articles/360035962891-Profile-Badges-101#h_01GM67K5EJ16ZHYZQ5MPRW3JT3"
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de BUGHUNTER_LEVEL_1 y tiene `true` en la configuración de la insignia del BUGHUNTER_LEVEL_1,
						if (badgeUserIDs.includes(ret.userId) && this.settings.BUGHUNTER_LEVEL_1 && !badgesList.includes("BUGHUNTER_LEVEL_1")) {
							ret.badges.push({
								id: "BUGHUNTER_LEVEL_1",
								icon: "2717692c7dca7289b35297368a940dd0",
								description: "Bug Hunter Level 1",
								link: "https://support.discord.com/hc/en-us/articles/360035962891-Profile-Badges-101#h_01GM67K5EJ16ZHYZQ5MPRW3JT3"
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de EARLY_VERIFIED_BOT_DEVELOPER y tiene `true` en la configuración de la insignia del EARLY_VERIFIED_BOT_DEVELOPER,
						if (badgeUserIDs.includes(ret.userId) && this.settings.EARLY_VERIFIED_BOT_DEVELOPER && !badgesList.includes("EARLY_VERIFIED_BOT_DEVELOPER")) {
							ret.badges.push({
								id: "EARLY_VERIFIED_BOT_DEVELOPER",
								icon: "6df5892e0f35b051f8b61eace34f4967",
								description: "Early Verified Bot Developer",
								link: ""
							});
						}

						//si el usuario actualmente procesado no tiene la insignia de NITRO y tiene `true` en la configuración de la insignia del NITRO,
						if (badgeUserIDs.includes(ret.userId) && this.settings.NITRO && !badgesList.includes("NITRO")) {
							//add the yabdp contributor badge to the contributor's list of badges
							ret.badges.push({
								id: "NITRO",
								icon: "2ba85e8026a8614b640c2837bcdfe21b",
								description: "Nitro User",
								link: "https://github.com/srgobi/BDNitro#contributors"
							});
						}

					}); //Fin del parche de getUserProfile
				} //Fin de LoadingBadges()

				secondsightifyRevealOnly(t) {
					if ([...t].some(x => (0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f))) {
						// 3y3 text detected. Revealing...
						return (t => ([...t].map(x => (0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f) ? String.fromCodePoint(x.codePointAt(0) - 0xe0000) : x).join("")))(t);
					} else {
						// no encoded text found, returning
						return;
					}
				}


				secondsightifyEncodeOnly(t) {
					if ([...t].some(x => (0xe0000 < x.codePointAt(0) && x.codePointAt(0) < 0xe007f))) {
						// 3y3 text detected. returning...
						return;
					} else {
						//3y3 text detected. revealing...
						return (t => [...t].map(x => (0x00 < x.codePointAt(0) && x.codePointAt(0) < 0x7f) ? String.fromCodePoint(x.codePointAt(0) + 0xe0000) : x).join(""))(t);
					}
				}


				//Everything related to Fake Profile Effects.
				async profileFX(secondsightifyEncodeOnly) {

					if (this.settings.killProfileEffects) return; //profileFX is mutually exclusive with killProfileEffects (obviously)


					//wait for profile effects module
					await Webpack.waitForModule(Webpack.Filters.byProps("profileEffects", "tryItOutId"));

					//try to get profile effects data
					if (this.profileEffects == undefined) this.profileEffects = Webpack.getStore("ProfileEffectStore").profileEffects;
					if (this.fetchProfileEffects == undefined) this.fetchProfileEffects = Webpack.getAllByKeys("z").filter((obj) => obj.z.toString().includes("USER_PROFILE_EFFECTS_FETCH"))[0].z;

					//if profile effects data hasn't been fetched by the client yet
					if (this.profileEffects == undefined) {
						//make the client fetch profile effects
						await this.fetchProfileEffects("No se pudieron recuperar los efectos del perfil.");
						//then wait for the effects to be fetched and store them
						this.profileEffects = Webpack.getStore("ProfileEffectStore").profileEffects;
					} else if (this.profileEffects.length == 0) {
						await this.fetchProfileEffects("No se pudieron recuperar los efectos del perfil.");
						this.profileEffects = Webpack.getStore("ProfileEffectStore").profileEffects;
					}

					let profileEffectIdList = new Array();
					for (let i = 0; i < this.profileEffects.length; i++) {
						profileEffectIdList.push(this.profileEffects[i].id);
					}


					BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, [args], ret) => {
						//error prevention
						if (ret == undefined) return;
						if (ret.bio == undefined) return;

						//reveal 3y3 encoded text. this string will also include the rest of the bio
						let revealedText = this.secondsightifyRevealOnly(ret.bio);
						if (revealedText == undefined) return;

						//if profile effect 3y3 is detected
						if (revealedText.includes("/fx")) {
							let position = revealedText.indexOf("/fx");
							if (position == undefined) return;

							//find the 2 characters after the /fx and parse int
							let effectIndex = parseInt(revealedText.slice(position + 3, position + 5));
							//ignore invalid data 
							if (isNaN(effectIndex)) return;
							//ignore if the profile effect id does not point to an actual profile effect
							if (profileEffectIdList[effectIndex] == undefined) return;
							//set the profile effect
							ret.profileEffectId = profileEffectIdList[effectIndex];

							//if for some reason we dont know what this user's ID is, stop here
							if (args == undefined) return;
							//otherwise add them to the list of users who show up with the BDNitro user badge
							if (!badgeUserIDs.includes(args)) badgeUserIDs.push(args);
						}
					}); //end of getUserProfile patch.

					//wait for profile effect section renderer to be loaded.
					await Webpack.waitForModule(Webpack.Filters.byStrings("initialSelectedEffectId"));

					//fetch the module now that it's loaded
					if (this.profileEffectSectionRenderer == undefined) this.profileEffectSectionRenderer = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("initialSelectedEffectId"))[0];

					//patch profile effect section renderer function to run the following code after the function runs
					BdApi.Patcher.after(this.getName(), this.profileEffectSectionRenderer, "Z", (_, [args], ret) => {
						//if this is the tryItOut flow, don't do anything.
						if (args.isTryItOutFlow) return;

						let profileEffectChildren = [];

						//for each profile effect
						for (let i = 0; i < this.profileEffects.length; i++) {

							//get preview image url
							let previewURL = this.profileEffects[i].config.thumbnailPreviewSrc;
							let title = this.profileEffects[i].config.title;
							//encode 3y3
							let encodedText = secondsightifyEncodeOnly("/fx" + i); //fx0, fx1, etc.
							//javascript that runs onclick for each profile effect button
							let copyDecoration3y3 = function () {
								const clipboardTextElem = document.createElement("textarea");
								clipboardTextElem.style.position = "fixed";
								clipboardTextElem.value = ` ${encodedText}`;
								document.body.appendChild(clipboardTextElem);
								clipboardTextElem.select();
								clipboardTextElem.setSelectionRange(0, 99999);
								document.execCommand("copy"); ZLibrary.Toasts.info("¡3y3 copiado al portapapeles!");
								document.body.removeChild(clipboardTextElem);
							}

							profileEffectChildren.push(
								BdApi.React.createElement("img", {
									className: "riolubruhsSecretStuff",
									onClick: copyDecoration3y3,
									src: previewURL,
									title,
									style: {
										width: "22.5%",
										cursor: "pointer",
										marginBottom: "0.5em",
										marginLeft: "0.5em",
										backgroundColor: "var(--background-tertiary)"
									}
								})
							);

							//add newline every 4th profile effect
							if ((i + 1) % 4 == 0) {
								profileEffectChildren.push(
									BdApi.React.createElement("br")
								);
							}
						}

						//Profile Effects Modal
						function EffectsModal() {
							const elem = BdApi.React.createElement("div", {
								style: {
									width: "100%",
									display: "block",
									color: "white",
									whiteSpace: "nowrap",
									overflow: "visible",
									marginTop: ".5em"
								},
								children: profileEffectChildren
							});
							return elem;
						}

						//Append Change Effect button
						ret.props.children.props.children.push(
							//self explanatory create react element
							BdApi.React.createElement("button", {
								children: "Change Effect [BDNitro]",
								className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
								size: "sizeSmall__71a98",
								id: "changeProfileEffectButton",
								style: {
									width: "100px",
									height: "32px",
									color: "white",
									marginLeft: "10px"
								},
								onClick: () => {
									BdApi.showConfirmationModal("Cambiar efecto de perfil (BDNitro)", BdApi.React.createElement(EffectsModal));
								}

							})
						);
					}); //end patch of profile effect section renderer function

				} //End of profileFX()


				killProfileFX() { //self explanatory
					BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, args, ret) => {
						if (ret == undefined) return;
						if (ret.profileEffectID == undefined) return;
						//self explanatory
						ret.profileEffectID = undefined;
					});
				}

				//Everything related to fake avatar decorations.

				storeProductsFromCategories = event => {
					if (event.categories) {
						event.categories.forEach(category => {
							category.products.forEach(product => {
								product.items.forEach(item => {
									if (item.asset) {
										Object.assign(this.settings.avatarDecorations)[item.id] = item.asset;
									}
								})
							})
						})
					}
				}

				async fakeAvatarDecorations() {
					//keep track of profiles downloaded
					BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, [args], ret) => {
						if (ret == undefined) return;
						if (ret.userId == undefined) return;
						if (downloadedUserProfiles.includes(args)) return;
						downloadedUserProfiles.push(ret.userId);
					});

					//apply decorations
					BdApi.Patcher.after(this.getName(), DiscordModules.UserStore, "getUser", (_, args, ret) => {
						//basic error checking
						if (args == undefined) return;
						if (args[0] == undefined) return;
						if (ret == undefined) return;
						let avatarDecorations = this.settings.avatarDecorations;

						function getRevealedText(self) {
							let revealedTextLocal = ""; //init empty string with local scope

							//if this user's profile has been downloaded
							if (downloadedUserProfiles.includes(args[0])) {
								//get the user's profile from the cached user profiles
								let userProfile = userProfileMod.getUserProfile(args[0]);

								//if their bio is empty, move on to the next check.
								if (userProfile.bio != undefined) {
									//reveal 3y3 encoded text
									revealedTextLocal = self.secondsightifyRevealOnly(String(userProfile.bio));
									//if there's no 3y3 text, move on to the next check.
									if (revealedTextLocal != undefined) {
										if (String(revealedTextLocal).includes("/a")) {
											//return bio with the 3y3 decoded
											return revealedTextLocal;
										}
									}
								}

							}
							if (DiscordModules.UserStatusStore.getActivities(args[0]).length > 0) {
								//grab user's activities (this includes custom status)
								let activities = DiscordModules.UserStatusStore.getActivities(args[0]);
								//if they don't have a custom status, stop processing.
								if (activities[0].name != "Custom Status") return;
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
						if (revealedText == "") return;

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
								sku_id: "1144003461608906824" //dummy sku id
							}

							//add user to the list of users to show with the BDNitro user badge we haven't already.
							if (!badgeUserIDs.includes(ret.id)) badgeUserIDs.push(ret.id);
						}
					}); //end of getUser patch for avatar decorations

					//subscribe to successful collectible category fetch event
					Dispatcher.subscribe("COLLECTIBLES_CATEGORIES_FETCH_SUCCESS", this.storeProductsFromCategories);

					//trigger decorations fetch
					FetchCollectibleCategories(
						{
							includeBundles: true,
							includeUnpublished: false,
							noCache: false,
							paymentGateway: undefined
						}
					)

					//Wait for avatar decor customization section render module to be loaded.
					await Webpack.waitForModule(Webpack.Filters.byStrings("userAvatarDecoration"));

					//Avatar decoration customization section render module/function.
					if (!this.decorationCustomizationSectionMod) this.decorationCustomizationSectionMod = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("userAvatarDecoration"))[0];

					//Avatar decoration customization section patch
					BdApi.Patcher.after(this.getName(), this.decorationCustomizationSectionMod, "Z", (_, [args], ret) => {
						//don't run if this is the try out nitro flow.
						if (args.isTryItOutFlow) return;

						//push change decoration button
						ret.props.children[0].props.children.push(
							BdApi.React.createElement("button", {
								id: "decorationButton",
								children: "Change Decoration [BDNitro]",
								style: {
									width: "100px",
									height: "50px",
									color: "white",
									borderRadius: "3px",
									marginLeft: "5px",
								},
								className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
								onClick: () => {
									BdApi.showConfirmationModal("Cambiar decoración de avatar (BDNitro)", BdApi.React.createElement(DecorModal));
								}
							})
						);


						let listOfDecorationIds = Object.keys(BdApi.getData(this.getName(), "settings").avatarDecorations);
						let avatarDecorationChildren = [];

						//for each avatar decoration
						for (let i = 0; i < listOfDecorationIds.length; i++) {

							//text to encode to 3y3
							let encodedText = this.secondsightifyEncodeOnly("/a" + listOfDecorationIds[i]); // /a[id]
							//javascript that runs onclick for each avatar decoration button
							let copyDecoration3y3 = function () {
								const clipboardTextElem = document.createElement("textarea");
								clipboardTextElem.style.position = "fixed";
								clipboardTextElem.value = ` ${encodedText}`;
								document.body.appendChild(clipboardTextElem);
								clipboardTextElem.select();
								clipboardTextElem.setSelectionRange(0, 99999);
								document.execCommand("copy");
								ZLibrary.Toasts.info("¡3y3 copiado al portapapeles!"); document.body.removeChild(clipboardTextElem);
							}
							let child = BdApi.React.createElement("img", {
								style: {
									width: "23%",
									cursor: "pointer",
									marginLeft: "5px",
									marginBottom: "10px",
									borderRadius: "4px",
									backgroundColor: "var(--background-tertiary)"
								},
								onClick: copyDecoration3y3,
								src: "https://cdn.discordapp.com/avatar-decoration-presets/" + this.settings.avatarDecorations[listOfDecorationIds[i]] + ".png?size=64"
							});
							avatarDecorationChildren.push(child);

							//add newline every 4th decoration
							if ((i + 1) % 4 == 0) {
								//avatarDecorationsHTML += "<br>"
								avatarDecorationChildren.push(BdApi.React.createElement("br"));
							}
						}

						function DecorModal() {
							return BdApi.React.createElement("div", {
								style: {
									width: "100%",
									display: "block",
									color: "white",
									whiteSpace: "nowrap",
									overflow: "visible",
									marginTop: ".5em"
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

					let extension = ".gif";
					if (!emoji.animated) {
						extension = ".png";
						if (!this.settings.PNGemote) {
							extension = ".webp";
						}
					}

					//Download emote by URL, convert to blob, then convert to File object
					let file = await fetch(url).then(r => r.blob()).then(blobFile => new File([blobFile], (emoji.name + extension)))
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
					uploadOptions.parsedMessage = { channelId: channelIdLmao, content: msg[1].content, tts: false, invalidEmojis: [] }

					//if this is not the first emoji uploaded
					if (runs > 1) {
						//make the message attached to the upload have no text
						uploadOptions.parsedMessage = { channelId: channelIdLmao, content: "", tts: false, invalidEmojis: [] }
					}

					try {
						await Uploader.uploadFiles(uploadOptions); //finally finish the process of uploading
					} catch (err) {
						console.error(err);
					}
				}


				//Whether we should skip the emoji bypass for a given emoji.
				// true = skip bypass
				// false = perform bypass
				emojiBypassForValidEmoji(emoji, currentChannelId) {
					if (this.settings.emojiBypassForValidEmoji) {
						if ((DiscordModules.SelectedGuildStore.getLastSelectedGuildId() == emoji.guildId && !emoji.animated
							&& (DiscordModules.ChannelStore.getChannel(currentChannelId.toString()).type <= 0 || DiscordModules.ChannelStore.getChannel(currentChannelId.toString()).type == 11) && emoji.available)
							//If emoji is from current guild, not animated, and we are actually in a guild channel,
							//and emoji is "available" (could be unavailable due to Server Boost level dropping), cancel emoji bypass

							|| emoji.managed) {
							// OR if emoji is "managed" (emoji.managed = whether the emoji is managed by a Twitch integration)
							return true;
						}



					}
					return false;
				}


				customVideoSettings() { //Unlock stream buttons, apply custom resolution and fps, and apply stream quality bypasses
					//If you're trying to figure this shit out yourself, I recommend uncommenting the line below.
					//console.log(StreamButtons);

					//Nice try, Discord.
					BdApi.Patcher.instead(this.getName(), StreamButtons, "L9", (_, [args]) => {
						//getApplicationFramerate
						return args;
					});
					BdApi.Patcher.instead(this.getName(), StreamButtons, "aW", (_, [args]) => {
						//getApplicationResolution
						return args;
					});

					//If custom resolution is enabled and the resolution is not set to 0,
					if (this.settings.ResolutionEnabled && this.settings.CustomResolution != 0) {
						//some of these properties are marked as read only, but they still allow you to delete them
						//so any time you see "delete", what we're doing is bypassing the read-only thing by deleting it and immediately remaking it.
						delete ApplicationStreamResolutions.RESOLUTION_1440;
						//Change 1440p resolution internally to custom resolution
						ApplicationStreamResolutions.RESOLUTION_1440 = this.settings.CustomResolution;

						//********************************** Requirements below this point*************************************
						ApplicationStreamSettingRequirements[4].resolution = this.settings.CustomResolution;
						ApplicationStreamSettingRequirements[5].resolution = this.settings.CustomResolution;
						ApplicationStreamSettingRequirements[6].resolution = this.settings.CustomResolution;


						//************************************Buttons below this point*****************************************
						//Set resolution button value to custom resolution
						ApplicationStreamResolutionButtons[2].value = this.settings.CustomResolution;
						delete ApplicationStreamResolutionButtons[2].label;
						//Set label of resolution button to custom resolution. This one is used in the popup window that appears before you start streaming.
						ApplicationStreamResolutionButtons[2].label = this.settings.CustomResolution.toString();

						//Set value of button with suffix label to custom resolution
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = this.settings.CustomResolution;
						delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
						//Set label of button with suffix label to custom resolution with "p" after it, ex: "1440p"
						//This one is used in the dropdown kind of menu after you've started streaming
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = this.settings.CustomResolution + "p";
					}

					//If custom resolution tick is disabled or custom resolution is set to 0,
					if (!this.settings.ResolutionEnabled || this.settings.CustomResolution == 0) {

						//Reset all values to defaults.
						delete ApplicationStreamResolutions.RESOLUTION_1440
						ApplicationStreamResolutions.RESOLUTION_1440 = 1440;
						ApplicationStreamSettingRequirements[4].resolution = 1440;
						ApplicationStreamSettingRequirements[5].resolution = 1440;
						ApplicationStreamSettingRequirements[6].resolution = 1440;
						ApplicationStreamResolutionButtons[2].value = 1440;
						delete ApplicationStreamResolutionButtons[2].label;
						ApplicationStreamResolutionButtons[2].label = "1440";
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = 1440;
						delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = "1440p";
					}

					//Removes stream setting requirements
					function removeQualityParameters(x) {
						try {
							delete x.quality
						} catch (err) {
						}
						try {
							delete x.guildPremiumTier
						} catch (err) {
						}
					}

					/*Remove each of the stream setting requirements 
					(which basically just tell your client what premiumType / guildPremiumTier you need to access that resolution)
					removing the setting requirements makes it default to thinking that every premiumType can use it.*/
					ApplicationStreamSettingRequirements.forEach(removeQualityParameters);
					function replace60FPSRequirements(x) {
						if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = BdApi.getData(this.getName(), "settings").CustomFPS;
					}
					function restore60FPSRequirements(x) {
						if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = 60;
					}

					//If Custom FPS is enabled and does not equal 60,
					if (this.settings.CustomFPSEnabled && this.CustomFPS != 60) {
						//remove FPS nitro requirements
						ApplicationStreamSettingRequirements.forEach(replace60FPSRequirements);
						//set suffix label button value to the custom number
						ApplicationStreamFPSButtonsWithSuffixLabel[2].value = this.settings.CustomFPS;
						delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
						//set button suffix label with the correct number with " FPS" after it. ex: "75 FPS". This one is used in the dropdown kind of menu
						ApplicationStreamFPSButtonsWithSuffixLabel[2].label = this.settings.CustomFPS + " FPS";
						//set fps button value to the correct number.
						ApplicationStreamFPSButtons[2].value = this.settings.CustomFPS;
						delete ApplicationStreamFPSButtons[2].label;
						//set fps button label to the correct number. This one is used in the popup window that appears before you start streaming.
						ApplicationStreamFPSButtons[2].label = this.settings.CustomFPS;
						ApplicationStreamFPS.FPS_60 = this.settings.CustomFPS;
					}

					//If custom FPS toggle is disabled, or custom fps is set to the default of 60,
					if (!this.settings.CustomFPSEnabled || this.CustomFPS == 60) {
						//Reset all values to defaults.
						ApplicationStreamSettingRequirements.forEach(restore60FPSRequirements);
						ApplicationStreamFPSButtonsWithSuffixLabel[2].value = 60;
						delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
						ApplicationStreamFPSButtonsWithSuffixLabel[2].label = "60 FPS";
						ApplicationStreamFPSButtons[2].value = 60;
						delete ApplicationStreamFPSButtons[2].label;
						ApplicationStreamFPSButtons[2].label = 60;
						ApplicationStreamFPS.FPS_60 = 60;
					}

				} //End of customVideoSettings()

				emojiBypass() {
					//Upload Emotes Method
					if (this.settings.uploadEmotes) {

						BdApi.Patcher.instead(this.getName(), DiscordModules.MessageActions, "_sendMessage", (_, msg, send) => {
							if (msg[2].poll != undefined || msg[2].activityAction != undefined) { //fix polls, activity actions
								send(msg[0], msg[1], msg[2], msg[3]);
								return;
							}
							if (document.getElementsByClassName("sdc-tooltip").length > 0) {
								let SDC_Tooltip = document.getElementsByClassName("sdc-tooltip")[0];
								if (SDC_Tooltip.innerHTML == "Disable Encryption") {
									//SDC Encryption Enabled
									send(msg[0], msg[1], msg[2], msg[3]);
									return;
								}
							}
							const currentChannelId = msg[0];
							let runs = 0; //number of times the uploader has run for this message
							msg[1].validNonShortcutEmojis.forEach(emoji => {
								if (this.emojiBypassForValidEmoji(emoji, currentChannelId)) return; //Unlocked emoji. Skip.
								if (emoji.type == "UNICODE") return; //If this "emoji" is actually a unicode character, it doesn't count. Skip bypassing if so.
								if (this.settings.PNGemote) {
									emoji.forcePNG = true; //replace WEBP with PNG if the option is enabled.
								}
								let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
								if (emojiUrl.startsWith("/assets/")) return; //System emoji. Skip.


								//If there is a backslash (\) before the emote we are processing,
								if (msg[1].content.includes("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">")) {
									//remove the backslash
									msg[1].content = msg[1].content.replace(("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"), ("<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"));
									//and skip bypass for that emote
									return;
								}

								runs++; // increment number of times the uploader has run for this message.

								//remove existing URL parameters and add custom URL parameters for user's size preference. quality is always lossless.
								emojiUrl = emojiUrl.split("?")[0] + `?size=${this.settings.emojiSize}&quality=lossless`;
								//remove emote from message.
								msg[1].content = msg[1].content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, "");
								//upload emote
								this.UploadEmote(emojiUrl, currentChannelId, msg, emoji, runs);
							});
							if ((msg[1].content !== undefined && (msg[1].content != "" || msg[2].activityAction != undefined)) && runs == 0) {
								send(msg[0], msg[1], msg[2], msg[3]);
							}
						});

						BdApi.Patcher.instead(this.getName(), Uploader, "uploadFiles", (_, [args], originalFunction) => {

							if (document.getElementsByClassName("sdc-tooltip").length > 0) {
								let SDC_Tooltip = document.getElementsByClassName("sdc-tooltip")[0];
								if (SDC_Tooltip.innerHTML == "Disable Encryption") {
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
									args.parsedMessage.validNonShortcutEmojis.forEach(emoji => {
										if (this.emojiBypassForValidEmoji(emoji, currentChannelId)) return; //Unlocked emoji. Skip.
										if (emoji.type == "UNICODE") return; //If this "emoji" is actually a unicode character, it doesn't count. Skip bypassing if so.
										if (this.settings.PNGemote) {
											emoji.forcePNG = true; //replace WEBP with PNG if the option is enabled.
										}

										let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
										if (emojiUrl.startsWith("/assets/")) return; //System emoji. Skip.

										//If there is a backslash (\) before the emote we are processing,
										if (args.parsedMessage.content.includes("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">")) {
											//remove the backslash
											args.parsedMessage.content = args.parsedMessage.content.replace(("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"), ("<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"));
											//and skip bypass for that emote
											return;
										}

										//add to list of emojis
										emojis.push(emoji);

										//remove emote from message.
										args.parsedMessage.content = args.parsedMessage.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, "");
									});

									//send file with text and shit
									originalFunction(args);

									//loop through emotes to send one at a time
									for (let i = 0; i < emojis.length; i++) {
										let emoji = emojis[i];
										let emojiUrl = AvatarDefaults.getEmojiURL(emoji);

										//remove existing URL parameters and add custom URL parameters for user's size preference. quality is always lossless.
										emojiUrl = emojiUrl.split("?")[0] + `?size=${this.settings.emojiSize}&quality=lossless`;

										this.UploadEmote(emojiUrl, currentChannelId, [currentChannelId, { content: "", tts: false, invalidEmojis: [] }], emoji, 1);
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
					const ghostmodetext = "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ "

					if (this.settings.ghostMode && !this.settings.uploadEmotes) {

						function ghostModeMethod(msg, currentChannelId, self) {
							if (document.getElementsByClassName("sdc-tooltip").length > 0) {
								let SDC_Tooltip = document.getElementsByClassName("sdc-tooltip")[0];
								if (SDC_Tooltip.innerHTML == "Disable Encryption") {
									//SDC Encryption Enabled
									return;
								}
							}
							let emojiGhostIteration = 0; // dummy value we add to the end of the URL parameters to make the same emoji appear more than once despite having the same URL.
							msg.validNonShortcutEmojis.forEach(emoji => {
								if (self.emojiBypassForValidEmoji(emoji, currentChannelId)) return;
								if (emoji.type == "UNICODE") return;
								if (self.settings.PNGemote) emoji.forcePNG = true;

								let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
								if (emojiUrl.startsWith("/assets/")) return;

								if (msg.content.includes("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">")) {
									msg.content = msg.content.replace(("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"), ("<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"));
									return; //If there is a backslash before the emoji, skip it.
								}

								//if ghost mode is not required
								if (msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, "") == "") {
									msg.content = msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, emojiUrl.split("?")[0] + `?size=${self.settings.emojiSize}&quality=lossless `)
									return;
								}
								emojiGhostIteration++; //increment dummy value

								//if message already has ghostmodetext.
								if (msg.content.includes(ghostmodetext)) {
									//remove processed emoji from the message
									msg.content = msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, ""),
										//add to the end of the message
										msg.content += " " + emojiUrl.split("?")[0] + `?size=${self.settings.emojiSize}&quality=lossless&${emojiGhostIteration} `
									return;
								}
								//if message doesn't already have ghostmodetext, remove processed emoji and add it to the end of the message with the ghost mode text
								msg.content = msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, ""), msg.content += ghostmodetext + "\n" + emojiUrl.split("?")[0] + `?size=${self.settings.emojiSize}&quality=lossless `
							});
						}

						//sending message in ghost mode
						BdApi.Patcher.before(this.getName(), DiscordModules.MessageActions, "sendMessage", (_, [currentChannelId, msg]) => {
							ghostModeMethod(msg, currentChannelId, this);
						});

						//uploading file with emoji in the message in ghost mode.
						BdApi.Patcher.before(this.getName(), Uploader, "uploadFiles", (_, [args], originalFunction) => {
							const currentChannelId = args.channelId;
							const msg = args.parsedMessage;
							ghostModeMethod(msg, currentChannelId, this);
						})

					}

					//Original method
					if (!this.settings.ghostMode && !this.settings.uploadEmotes) {

						function classicModeMethod(msg, currentChannelId, self) {
							if (document.getElementsByClassName("sdc-tooltip").length > 0) {
								let SDC_Tooltip = document.getElementsByClassName("sdc-tooltip")[0];
								if (SDC_Tooltip.innerHTML == "Disable Encryption") {
									//SDC Encryption Enabled
									return;
								}
							}
							//refer to previous bypasses for comments on what this all is for.
							let emojiGhostIteration = 0;
							msg.validNonShortcutEmojis.forEach(emoji => {
								if (self.emojiBypassForValidEmoji(emoji, currentChannelId)) return;
								if (emoji.type == "UNICODE") return;
								if (self.settings.PNGemote) emoji.forcePNG = true;

								let emojiUrl = AvatarDefaults.getEmojiURL(emoji);
								if (emojiUrl.startsWith("/assets/")) return;

								if (msg.content.includes("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">")) {
									msg.content = msg.content.replace(("\\<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"), ("<" + emoji.allNamesString.replace(/~\b\d+\b/g, "") + emoji.id + ">"));
									return //If there is a backslash before the emoji, skip it.
								}
								emojiGhostIteration++;
								msg.content = msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\b\d+\b/g, "")}${emoji.id}>`, emojiUrl.split("?")[0] + `?size=${self.settings.emojiSize}&quality=lossless&${emojiGhostIteration} `)
							});
						}

						//sending message in classic mode
						BdApi.Patcher.before(this.getName(), DiscordModules.MessageActions, "sendMessage", (_, [currentChannelId, msg]) => {
							classicModeMethod(msg, currentChannelId, this);
						});

						//uploading file with emoji in the message in classic mode.
						BdApi.Patcher.before(this.getName(), Uploader, "uploadFiles", (_, [args], originalFunction) => {
							const msg = args.parsedMessage;
							const currentChannelId = args.channelId;
							classicModeMethod(msg, currentChannelId, this);
						});

						//editing message in classic mode
						BdApi.Patcher.before(this.getName(), DiscordModules.MessageActions, "editMessage", (_, obj) => {
							let msg = obj[2].content
							if (msg.search(/\d{18}/g) == -1) return;
							if (msg.includes(":ENC:")) return; //Fix jank with editing SimpleDiscordCrypt encrypted messages.
							msg.match(/<a:.+?:\d{18}>|<:.+?:\d{18}>/g).forEach(idfkAnymore => {
								obj[2].content = obj[2].content.replace(idfkAnymore, `https://cdn.discordapp.com/emojis/${idfkAnymore.match(/\d{18}/g)[0]}?size=${this.settings.emojiSize}`)
							})
						});
						return;
					}
				} //End of emojiBypass()


				updateQuick() { //Function that runs when the resolution/fps quick menu is changed.
					//Refer to customVideoSettings function for comments on what this all does, since this code is just a copy-paste from there.
					const settings = BdApi.getData("BDNitro", "settings");
					parseInt(document.getElementById("qualityInput").value);
					settings.CustomResolution = parseInt(document.getElementById("qualityInput").value);
					parseInt(document.getElementById("qualityInputFPS").value);
					settings.CustomFPS = parseInt(document.getElementById("qualityInputFPS").value);
					if (parseInt(document.getElementById("qualityInputFPS").value) == 15) settings.CustomFPS = 16;
					if (parseInt(document.getElementById("qualityInputFPS").value) == 30) settings.CustomFPS = 31;
					if (parseInt(document.getElementById("qualityInputFPS").value) == 5) settings.CustomFPS = 6;

					if (settings.ResolutionEnabled && settings.CustomResolution != 0) {
						delete ApplicationStreamResolutions.RESOLUTION_1440
						ApplicationStreamResolutions.RESOLUTION_1440 = settings.CustomResolution;
						ApplicationStreamSettingRequirements[4].resolution = settings.CustomResolution;
						ApplicationStreamSettingRequirements[5].resolution = settings.CustomResolution;
						ApplicationStreamSettingRequirements[6].resolution = settings.CustomResolution;
						ApplicationStreamResolutionButtons[2].value = settings.CustomResolution;
						delete ApplicationStreamResolutionButtons[2].label;
						ApplicationStreamResolutionButtons[2].label = settings.CustomResolution.toString();
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = settings.CustomResolution;
						delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = settings.CustomResolution + "p";
					}
					if (!settings.ResolutionEnabled || (settings.CustomResolution == 0)) {
						delete ApplicationStreamResolutions.RESOLUTION_1440
						ApplicationStreamResolutions.RESOLUTION_1440 = 1440;
						ApplicationStreamSettingRequirements[4].resolution = 1440;
						ApplicationStreamSettingRequirements[5].resolution = 1440;
						ApplicationStreamSettingRequirements[6].resolution = 1440;
						ApplicationStreamResolutionButtons[2].value = 1440;
						delete ApplicationStreamResolutionButtons[2].label;
						ApplicationStreamResolutionButtons[2].label = "1440";
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].value = 1440;
						delete ApplicationStreamResolutionButtonsWithSuffixLabel[3].label;
						ApplicationStreamResolutionButtonsWithSuffixLabel[3].label = "1440p";
					}
					function replace60FPSRequirements(x) {
						if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = BdApi.getData("BDNitro", "settings").CustomFPS;
					}
					function restore60FPSRequirements(x) {
						if (x.fps != 30 && x.fps != 15 && x.fps != 5) x.fps = 60;
					}

					if (settings.CustomFPSEnabled) {
						if (this.CustomFPS != 60) {
							ApplicationStreamSettingRequirements.forEach(replace60FPSRequirements);
							ApplicationStreamFPSButtonsWithSuffixLabel[2].value = settings.CustomFPS;
							delete ApplicationStreamFPSButtonsWithSuffixLabel[2].label;
							ApplicationStreamFPSButtonsWithSuffixLabel[2].label = settings.CustomFPS + " FPS";
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
						ApplicationStreamFPSButtonsWithSuffixLabel[2].label = 60 + " FPS";
						ApplicationStreamFPSButtons[2].value = 60;
						delete ApplicationStreamFPSButtons[2].label;
						ApplicationStreamFPSButtons[2].label = 60;
						ApplicationStreamFPS.FPS_60 = 60;
					}
				} //End of updateQuick()


				videoQualityModule() { //Custom Bitrates, FPS, Resolution
					if (this.videoOptionFunctions == undefined) this.videoOptionFunctions = Webpack.getByPrototypeKeys("updateVideoQuality").prototype;
					BdApi.Patcher.before(this.getName(), this.videoOptionFunctions, "updateVideoQuality", (e) => {

						if (!e.videoQualityManager.qualityOverwrite) e.videoQualityManager.qualityOverwrite = {};


						if (this.settings.minBitrate > 0 && this.settings.CustomBitrateEnabled) {
							//Minimum Bitrate
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateMin = (this.settings.minBitrate * 1000);
							e.videoQualityManager.qualityOverwrite.bitrateMin = (this.settings.minBitrate * 1000);
							e.videoQualityManager.options.videoBitrateFloor = (this.settings.minBitrate * 1000);
							e.videoQualityManager.options.videoBitrate.min = (this.settings.minBitrate * 1000);
							e.videoQualityManager.options.desktopBitrate.min = (this.settings.minBitrate * 1000);
						} else {
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateMin = 150000;
							e.videoQualityManager.qualityOverwrite.bitrateMin = 150000;
							e.videoQualityManager.options.videoBitrateFloor = 150000;
							e.videoQualityManager.options.videoBitrate.min = 150000;
							e.videoQualityManager.options.desktopBitrate.min = 150000;
						}

						if (this.settings.maxBitrate > 0 && this.settings.CustomBitrateEnabled) {
							//Maximum Bitrate
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateMax = (this.settings.maxBitrate * 1000);
							e.videoQualityManager.qualityOverwrite.bitrateMax = (this.settings.maxBitrate * 1000);
							e.videoQualityManager.options.videoBitrate.max = (this.settings.maxBitrate * 1000);
							e.videoQualityManager.options.desktopBitrate.max = (this.settings.maxBitrate * 1000);
						} else {
							//Default max bitrate
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateMax = 2500000;
							e.videoQualityManager.qualityOverwrite.bitrateMax = 2500000;
							e.videoQualityManager.options.videoBitrate.max = 2500000;
							e.videoQualityManager.options.desktopBitrate.max = 2500000;
						}

						if (this.settings.targetBitrate > 0 && this.settings.CustomBitrateEnabled) {
							//Target Bitrate
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateTarget = (this.settings.targetBitrate * 1000);
							e.videoQualityManager.qualityOverwrite.bitrateTarget = (this.settings.targetBitrate * 1000);
							e.videoQualityManager.options.desktopBitrate.target = (this.settings.targetBitrate * 1000);
						} else {
							//Default target bitrate
							e.framerateReducer.sinkWants.qualityOverwrite.bitrateTarget = 600000;
							e.videoQualityManager.qualityOverwrite.bitrateTarget = 600000;
							e.videoQualityManager.options.desktopBitrate.target = 600000;
						}

						if (this.settings.voiceBitrate != 128) {
							//Audio Bitrate
							e.voiceBitrate = this.settings.voiceBitrate * 1000;

							e.conn.setTransportOptions({
								encodingVoiceBitRate: e.voiceBitrate
							});
						}

						//Video quality bypasses if Custom FPS is enabled.
						if (this.settings.CustomFPSEnabled) {
							//This is pretty self-explanatory.
							e.videoQualityManager.options.videoBudget.framerate = this.settings.CustomFPS;
							e.videoQualityManager.options.videoCapture.framerate = this.settings.CustomFPS;
						}

						//If screen sharing bypasses are enabled,
						if (this.settings.screenSharing) {
							//Ensure video quality parameters match the stream parameters.
							const videoQuality = new Object({
								width: e.videoStreamParameters[0].maxResolution.width,
								height: e.videoStreamParameters[0].maxResolution.height,
								framerate: e.videoStreamParameters[0].maxFrameRate,
							});

							if (e.stats?.camera != undefined && this.settings.CustomFPSEnabled) {
								videoQuality.framerate = this.settings.CustomFPS;
							}

							e.remoteSinkWantsMaxFramerate = e.videoStreamParameters[0].maxFrameRate;

							//janky fix to #218
							if (videoQuality.width <= 0) {
								videoQuality.width = 2160;
								if ((this.settings.CustomResolution * (16 / 9)) > (2160 * (16 / 9)))
									videoQuality.width = this.settings.CustomResolution * (16 / 9);
							}
							if (videoQuality.height <= 0) {
								videoQuality.height = 1440;
								if (this.settings.CustomResolution > 1440)
									videoQuality.width = this.settings.CustomResolution;
							}

							//Ensure video budget quality parameters match stream parameters
							e.videoQualityManager.options.videoBudget = videoQuality;
							//Ensure video capture quality parameters match stream parameters
							e.videoQualityManager.options.videoCapture = videoQuality;

							//janky camera bypass
							if (e.stats?.camera != undefined) {
								for (let i = 0; i < e.videoStreamParameters.length; i++) {
									if (this.settings.ResolutionEnabled && this.settings.CustomResolution > -1) {
										e.videoStreamParameters[i].maxResolution.height = this.settings.CustomResolution;
										e.videoStreamParameters[i].maxResolution.width = (16 / 9) * this.settings.CustomResolution;
										e.videoStreamParameters[i].maxPixelCount = (e.videoStreamParameters[i].maxResolution.height * e.videoStreamParameters[i].maxResolution.width);

									}
									if (this.settings.CustomFPSEnabled && this.settings.CustomFPS > -1)
										e.videoStreamParameters[i].maxFrameRate = this.settings.CustomFPS;
								}
							}

							//Ladder bypasses
							let pixelBudget = (videoQuality.width * videoQuality.height);
							e.videoQualityManager.ladder.pixelBudget = pixelBudget
							e.videoQualityManager.ladder.ladder = LadderModule.calculateLadder(pixelBudget);
							e.videoQualityManager.ladder.orderedLadder = LadderModule.calculateOrderedLadder(e.videoQualityManager.ladder.ladder);
						}


						// Video codecs
						if (this.settings.videoCodec > 0) {
							//This code determines what codec was chosen
							let isCodecH265 = false;
							let isCodecH264 = false;
							let isCodecAV1 = false;
							let isCodecVP8 = false;
							let isCodecVP9 = false;
							switch (this.settings.videoCodec) {
								case 1:
									isCodecH265 = true;
									break;
								case 2:
									isCodecH264 = true;
									break;
								case 3:
									isCodecAV1 = true;
									break;
								case 4:
									isCodecVP8 = true;
									break;
								case 5:
									isCodecVP9 = true;
									break;
							}


							//This code determines what priorities to set each codec to based on which one was chosen by the user.
							let currentHighestNum = 1;
							function setPriority(codec) {
								switch (codec) {
									case 0:
										if (isCodecH265) {
											return 1;
										} else {
											currentHighestNum += 1;
											return currentHighestNum;
										}
										break;
									case 1:
										if (isCodecH264) {
											return 1;
										} else {
											currentHighestNum += 1;
											return currentHighestNum;
										}
										break;

									case 2:
										if (isCodecAV1) {
											return 1;
										} else {
											currentHighestNum += 1;
											return currentHighestNum;
										}
										break;
									case 3:
										if (isCodecVP8) {
											return 1;
										} else {
											currentHighestNum += 1;
											return currentHighestNum;
										}
										break;
									case 4:
										if (isCodecVP9) {
											return 1;
										} else {
											currentHighestNum += 1;
											return currentHighestNum;
										}
										break;
								}
							}

							//and this code sets the priorities based on the outputs of setPriority.
							if (e.codecs != undefined && e.codecs[1]?.decode != undefined) {

								e.codecs[1].decode = isCodecH265; //H.265
								e.codecs[1].encode = isCodecH265;
								e.codecs[1].priority = parseInt(setPriority(0));

								e.codecs[2].decode = isCodecH264; //H.264
								e.codecs[2].encode = isCodecH264;
								e.codecs[2].priority = parseInt(setPriority(1));

								e.codecs[3].decode = isCodecVP8; //VP8
								e.codecs[3].encode = isCodecVP8;
								e.codecs[3].priority = parseInt(setPriority(2));

								e.codecs[4].decode = isCodecVP9; //VP9
								e.codecs[4].encode = isCodecVP9;
								e.codecs[4].priority = parseInt(setPriority(3));
							}
						}
					});
				} //End of videoQualityModule()


				buttonCreate() { //Creates the FPS and Resolution Swapper
					let qualityButton = document.createElement('button');
					qualityButton.id = 'qualityButton';
					qualityButton.className = `${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand}`;
					qualityButton.innerHTML = '<p style="display: block-inline; margin-left: -6%; margin-top: -4.5%;">Quality</p>';
					qualityButton.style.position = "absolute";
					qualityButton.style.zIndex = "2";
					qualityButton.style.bottom = "0";
					qualityButton.style.left = "50%";
					qualityButton.style.transform = "translateX(-50%)";
					qualityButton.style.height = "15px";
					qualityButton.style.width = "48px";
					qualityButton.style.verticalAlign = "middle";
					qualityButton.style.textAlign = "left";
					qualityButton.style.borderTopLeftRadius = "5px";
					qualityButton.style.borderTopRightRadius = "4px";
					qualityButton.style.borderBottomLeftRadius = "4px";
					qualityButton.style.borderBottomRightRadius = "4px";

					qualityButton.onclick = function () {
						if (qualityMenu.style.visibility == "hidden") {
							qualityMenu.style.visibility = "visible";
						} else {
							qualityMenu.style.visibility = "hidden";
						}
					}

					try {
						document.getElementsByClassName(DiscordClassModules.AccountDetails.container)[0].appendChild(qualityButton);
					} catch (err) {
						console.error("[BDNitro] ¿Qué carajo pasó...? Durante el botónCrear()" + err);
					}

					let qualityMenu = document.createElement('div');
					qualityMenu.id = 'qualityMenu';
					qualityMenu.style.visibility = 'hidden';
					qualityMenu.style.position = "relative";
					qualityMenu.style.zIndex = "1";
					qualityMenu.style.bottom = "410%";
					qualityMenu.style.left = "-59%";
					qualityMenu.style.height = "20px";
					qualityMenu.style.width = "100px";
					qualityMenu.onclick = function (event) {
						event.stopPropagation();
					}

					document.getElementById("qualityButton").appendChild(qualityMenu);

					let qualityInput = document.createElement('input');
					qualityInput.id = 'qualityInput';
					qualityInput.type = 'text';
					qualityInput.placeholder = 'Resolution';
					qualityInput.style.width = "33%";
					qualityInput.style.zIndex = "1";
					qualityInput.value = this.settings.CustomResolution;
					qualityMenu.appendChild(qualityInput);

					let qualityInputFPS = document.createElement('input');
					qualityInputFPS.id = 'qualityInputFPS';
					qualityInputFPS.type = 'text';
					qualityInputFPS.placeholder = 'FPS';
					qualityInputFPS.style.width = "33%";
					qualityInputFPS.style.zIndex = "1";
					qualityInputFPS.value = this.settings.CustomFPS;
					qualityMenu.appendChild(qualityInputFPS);
				} //End of buttonCreate()


				async stickerSending() {
					if (this.stickerSendabilityModule == undefined) this.stickerSendabilityModule = Webpack.getByKeys("cO", "eb", "kl");

					//getStickerSendability
					BdApi.Patcher.instead(this.getName(), this.stickerSendabilityModule, "cO", () => {
						return 0;
					});

					//isSendableSticker
					BdApi.Patcher.instead(this.getName(), this.stickerSendabilityModule, "kl", () => {
						return true;
					});

					BdApi.Patcher.instead(this.getName(), DiscordModules.MessageActions, "sendStickers", (_, args, originalFunction) => {
						let stickerID = args[1][0];
						let stickerURL = "https://media.discordapp.net/stickers/" + stickerID + ".png?size=4096&quality=lossless"
						let currentChannelId = DiscordModules.SelectedChannelStore.getChannelId();

						if (this.settings.uploadStickers) {
							let emoji = new Object();
							emoji.animated = false;
							emoji.name = args[0];
							let msg = [undefined, { content: "" }]
							this.UploadEmote(stickerURL, currentChannelId, [undefined, { content: "" }], emoji)
							return;
						}
						if (!this.settings.uploadStickers) {
							let messageContent = { content: stickerURL, tts: false, invalidEmojis: [], validNonShortcutEmojis: [] }
							DiscordModules.MessageActions.sendMessage(currentChannelId, messageContent, undefined, {})
						}
					});
				}


				decodeAndApplyProfileColors() {
					BdApi.Patcher.after(this.getName(), userProfileMod, "getUserProfile", (_, args, ret) => {
						if (ret == undefined) return;
						if (ret.bio == null) return;
						const colorString = ret.bio.match(
							/\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u,
						);
						if (colorString == null) return;
						let parsed = [...colorString[0]].map((c) => String.fromCodePoint(c.codePointAt(0) - 0xe0000)).join("");
						let colors = parsed
							.substring(1, parsed.length - 1)
							.split(",")
							.map(x => parseInt(x.replace("#", "0x"), 16));
						ret.themeColors = colors;
						ret.premiumType = 2;
					});
				}


				//Everything that has to do with the GUI and encoding of the fake profile colors 3y3 shit.
				//Replaced DOM manipulation with React patching 4/2/2024
				async encodeProfileColors(primary, accent) {

					//wait for theme color picker module to be loaded
					await Webpack.waitForModule(Webpack.Filters.byProps("getTryItOutThemeColors"));

					//wait for color picker renderer module to be loaded
					await Webpack.waitForModule(Webpack.Filters.byStrings("__invalid_profileThemesSection"));

					if (this.colorPickerRendererMod == undefined) this.colorPickerRendererMod = Webpack.getAllByKeys("Z").filter(obj => obj.Z.toString().includes("__invalid_profileThemesSection"))[0];

					BdApi.Patcher.after(this.getName(), this.colorPickerRendererMod, "Z", (_, args, ret) => {

						ret.props.children.props.children.push( //append copy colors 3y3 button
							BdApi.React.createElement("button", {
								id: "copy3y3button",
								children: "Copy Colors 3y3",
								className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
								style: {
									marginLeft: "10px",
									marginTop: "10px"
								},
								onClick: () => {
									let themeColors = null;
									try {
										themeColors = Webpack.getStore("UserSettingsAccountStore").getAllTryItOut().tryItOutThemeColors;
									} catch (err) {
										console.warn(err);
									}
									if (themeColors == null) {
										try {
											themeColors = Webpack.getStore("UserSettingsAccountStore").getAllPending().pendingThemeColors;
										} catch (err) {
											console.error(err);
										}
									}
									if (themeColors == undefined) {
										Toasts.warning("No se ha copiado nada. ¿El color seleccionado es idéntico a su color actual?");
										return;
									}
									const primary = themeColors[0];
									const accent = themeColors[1];
									let message = `[#${primary.toString(16).padStart(6, "0")},#${accent.toString(16).padStart(6, "0")}]`;
									const padding = "";
									let encoded = Array.from(message)
										.map(x => x.codePointAt(0))
										.filter(x => x >= 0x20 && x <= 0x7f)
										.map(x => String.fromCodePoint(x + 0xe0000))
										.join("");

									let encodedStr = ((padding || "") + " " + encoded);

									//do this stupid shit Chrome makes you do to copy text to the clipboard.
									const clipboardTextElem = document.createElement("textarea");
									clipboardTextElem.style.position = 'fixed';
									clipboardTextElem.value = encodedStr;
									document.body.appendChild(clipboardTextElem);
									clipboardTextElem.select();
									clipboardTextElem.setSelectionRange(0, 99999);
									document.execCommand('copy');
									Toasts.info("¡3y3 copiado al portapapeles!");
									document.body.removeChild(clipboardTextElem);
								}
							})
						);
					});

				} //End of encodeProfileColors()


				//Commented to hell and back on 3/6/2024
				bannerUrlDecoding() { //Decode 3y3 from profile bio and apply fake banners.

					let endpoint, bucket, prefix, data;

					//if userBg integration is enabled, and we havent already downloaded & parsed userBg data,
					if (this.settings.userBgIntegration && !fetchedUserBg) {

						//userBg database url.
						const userBgJsonUrl = "https://usrbg.is-hardly.online/users";

						//download, then store json
						BdApi.Net.fetch(userBgJsonUrl).then(res => res.json().then(res => {
							data = res;
							endpoint = res.endpoint;
							bucket = res.bucket;
							prefix = res.prefix;
							usrBgUsers = Object.keys(res.users);
							//mark db as fetched so we only fetch it once per load of the plugin
							fetchedUserBg = true;
						}));
					}

					//Patch getUserBannerURL function
					BdApi.Patcher.before(this.getName(), AvatarDefaults, "getUserBannerURL", (_, args) => {
						args[0].canAnimate = true;
					});

					//Patch getBannerURL function
					BdApi.Patcher.instead(this.getName(), getBannerURL, "getBannerURL", (user, [args], ogFunction) => {
						let profile = user._userProfile;

						//Returning ogFunction with the same arguments that were passed to this function will do the vanilla check for a legit banner.
						if (profile == undefined) return ogFunction(args);

						if (this.settings.userBgIntegration) { //if userBg integration is enabled

							//if we've fetched the userbg database
							if (fetchedUserBg) {
								//if user is in userBg database,
								if (usrBgUsers.includes(user.userId)) {
									profile.banner = "funky_kong_is_epic"; //set banner id to fake value
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
						let regex = /B\{[^}]*\}/;

						//find banner url in parsed bio
						let matches = parsed.toString().match(regex);

						//if there's no matches, return original function
						if (matches == undefined) return ogFunction(args);
						if (matches == "") return ogFunction(args);

						//if there is matched text, grab the first match, replace the starting "B{" and ending "}" to get the clean filename
						let matchedText = matches[0].replace("B{", "").replace("}", "");

						//Checking for file extension. 
						if (!String(matchedText).endsWith(".gif") && !String(matchedText).endsWith(".png") && !String(matchedText).endsWith(".jpg") && !String(matchedText).endsWith(".jpeg") && !String(matchedText).endsWith(".webp")) {
							matchedText += ".gif"; //Fallback to a default file extension if one is not found.

						}

						//set banner id to fake value
						profile.banner = "funky_kong_is_epic"

						//set this profile to appear with premium rendering
						profile.premiumType = 2;

						//add this user to the list of users that show with the BDNitro user badge if we haven't aleady.
						if (!badgeUserIDs.includes(user.userId)) badgeUserIDs.push(user.userId);

						//return final banner URL.
						return `https://i.imgur.com/${matchedText}`;

					}); //End of patch for getBannerURL

					if (this.profileRenderer == undefined) this.profileRenderer = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("PRESS_PREMIUM_UPSELL"))[0]

					BdApi.Patcher.before(this.getName(), this.profileRenderer, "Z", (_, args) => {
						if (args == undefined) return;
						if (args[0]?.displayProfile?.banner == undefined) return;

						//if this user's banner is a fake banner
						if (args[0].displayProfile.banner == "funky_kong_is_epic") {
							//don't show upsell
							args[0].showPremiumBadgeUpsell = false;
						}
					});

					BdApi.Patcher.after(this.getName(), this.profileRenderer, "Z", (_, args, ret) => {
						if (args == undefined) return;
						if (args[0]?.displayProfile?.banner == undefined) return;
						if (ret == undefined) return;
						if (ret.props?.hasBanner == undefined) return;
						//if this user's banner is a fake banner
						if (args[0].displayProfile.banner == "funky_kong_is_epic") {
							//tell the profile renderer to show them as having a banner.
							ret.props.hasBanner = true;
						}
					});
				} //End of bannerUrlDecoding()


				//Make buttons in profile customization settings, encode imgur URLs and copy to clipboard
				//Documented/commented and partially rewritten to use React patching on 3/6/2024
				async bannerUrlEncoding(secondsightifyEncodeOnly) {

					//wait for banner customization renderer module to be loaded
					await Webpack.waitForModule(Webpack.Filters.byStrings("USER_SETTINGS_PROFILE_BANNER"));
					if (this.profileBannerSectionRenderer == undefined) this.profileBannerSectionRenderer = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("USER_SETTINGS_PROFILE_BANNER"))[0];

					BdApi.Patcher.after(this.getName(), this.profileBannerSectionRenderer, "Z", (_, args, ret) => {

						args[0].showPremiumIcon = false;

						//create and append profileBannerUrlInput input element.
						ret.props.children.props.children.push(
							BdApi.React.createElement("input", {
								id: "profileBannerUrlInput",
								placeholder: "Imgur URL",
								style: {
									width: "30%",
									height: "20%",
									maxHeight: "50%",
									marginLeft: "10px",
									marginTop: "5px"
								}
							})
						);

						ret.props.children.props.children.push( //append Copy 3y3 button
							//create react element

							BdApi.React.createElement("button", {
								id: "profileBannerButton",
								children: "Copy Banner 3y3",
								className: `${buttonClassModule.button} ${buttonClassModule.lookFilled} ${buttonClassModule.colorBrand} ${buttonClassModule.sizeSmall} ${buttonClassModule.grow}`,
								size: "sizeSmall__71a98",
								style: {
									whiteSpace: "nowrap",
									marginLeft: "10px"
								},
								onClick: async function () { //Upon clicking Copy 3y3 button

									//grab text from banner URL input textarea 
									let profileBannerUrlInputValue = String(document.getElementById("profileBannerUrlInput").value);

									//if it's empty, stop processing.
									if (profileBannerUrlInputValue == "") return;
									if (profileBannerUrlInputValue == undefined) return;

									//clean up string to encode
									let stringToEncode = "" + profileBannerUrlInputValue
										.replace("http://", "") //get rid of protocol
										.replace("https://", "")
										.replace(".jpg", "")
										.replace(".png", "")
										.replace(".mp4", "")
										.replace("webm", "")
										.replace("i.imgur.com", "imgur.com"); //change i.imgur.com to imgur.com


									let encodedStr = ""; //initialize encoded string as empty string

									stringToEncode = String(stringToEncode); //make doubly sure stringToEncode is a string

									//if url seems correct
									if (stringToEncode.toLowerCase().startsWith("imgur.com")) {

										//Check for album or gallery URL
										if (stringToEncode.replace("imgur.com/", "").startsWith("a/") || stringToEncode.replace("imgur.com/", "").startsWith("gallery/")) {

											//Album URL, what follows is all to get the direct image link, since the album URL is not a direct link to the file.

											//Fetch imgur album page
											try {
												const parser = new DOMParser();
												stringToEncode = await BdApi.Net.fetch(("https://" + stringToEncode), {
													method: "GET",
													mode: "cors"
												}).then(res => res.text()
													//parse html, queryselect meta tag with certain name
													.then(res => parser.parseFromString(res, "text/html").querySelector('[name="twitter:player"]').content));
												stringToEncode = stringToEncode.replace("http://", "") //get rid of protocol
													.replace("https://", "") //get rid of protocol
													.replace("i.imgur.com", "imgur.com")
													.replace(".jpg", "").replace(".jpeg", "").replace(".webp", "").replace(".png", "").replace(".mp4", "").replace(".webm", "").replace(".gifv", "").replace(".gif", "") //get rid of any file extension
													.split("?")[0]; //remove any URL parameters since we don't want or need them
											} catch (err) {
												ZLibrary.Logger.err("BDNitro", err);
												ZLibrary.Toasts.error("Se produjo un error. ¿Hay varias imágenes en este álbum/galería?");
												return;
											}
										}
										if (stringToEncode == "") {
											ZLibrary.Toasts.error("Se produjo un error: no se pudo encontrar el nombre del archivo.");
											ZLibrary.Logger.err("BDNitro", "No se pudo encontrar el nombre del archivo por algún motivo. Póngase en contacto con SrGobi.");
										}
										//add starting "B{" , remove "imgur.com/" , and add ending "}"
										stringToEncode = "B{" + stringToEncode.replace("imgur.com/", "") + "}"
										//finally encode the string, adding a space before it so nothing fucks up
										encodedStr = " " + secondsightifyEncodeOnly(stringToEncode);
										//let the user know what has happened
										Toasts.info("¡3y3 copiado al portapapeles!");

										//If this is not an Imgur URL, yell at the user.
									} else if (stringToEncode.toLowerCase().startsWith("imgur.com") == false) {
										Toasts.warning("¡Por favor usa Imgur!");
										return;
									}

									//if somehow none of the previous code ran, this is the last protection against an error. If this runs, something has probably gone horribly wrong.
									if (encodedStr == "") return;

									//Do this stupid shit that Chrome forces you to do to copy text to the clipboard.
									const clipboardTextElem = document.createElement("textarea"); //create a textarea
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
					this.settings.changePremiumType = true; //Forcibly enable premiumType. Couldn't find a workaround, sry.

					try {
						if (!(ORIGINAL_NITRO_STATUS > 1)) {
							CurrentUser.premiumType = 1;
							setTimeout(() => {
								if (this.settings.changePremiumType) {
									CurrentUser.premiumType = 1;
								}
							}, 10000);
						}
					}
					catch (err) {
						Logger.err(this.getName(), "Error occurred changing premium type. " + err);
					}

					if (this.appIconModule == undefined) this.appIconModule = Webpack.getByKeys("getCurrentDesktopIcon");
					delete this.appIconModule.isUpsellPreview;
					Object.defineProperty(this.appIconModule, "isUpsellPreview", {
						value: false,
						configurable: true,
						enumerable: true,
						writable: true,
					});

					delete this.appIconModule.isEditorOpen;
					Object.defineProperty(this.appIconModule, "isEditorOpen", {
						value: false,
						configurable: true,
						enumerable: true,
						writable: true,
					});

					if (this.appIconButtonsModule == undefined) this.appIconButtonsModule = Webpack.getAllByKeys("Z").filter((obj) => obj.Z.toString().includes("renderCTAButtons"))[0];
					BdApi.Patcher.before(this.getName(), this.appIconButtonsModule, "Z", (_, args) => {
						args[0].disabled = false; //force buttons clickable
					});
				}


				onStart() {
					PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this._config.info.github_raw);
					this.saveAndUpdate();
				}


				onStop() {
					CurrentUser.premiumType = ORIGINAL_NITRO_STATUS;
					BdApi.Patcher.unpatchAll(this.getName());
					Dispatcher.unsubscribe("COLLECTIBLES_CATEGORIES_FETCH_SUCCESS", this.storeProductsFromCategories);
					if (document.getElementById("qualityButton")) document.getElementById("qualityButton").remove();
					if (document.getElementById("qualityMenu")) document.getElementById("qualityMenu").remove();
					if (document.getElementById("qualityInput")) document.getElementById("qualityInput").remove();
					if (document.getElementById("copy3y3button")) document.getElementById("copy3y3button").remove();
					if (document.getElementById("profileBannerButton")) document.getElementById("profileBannerButton").remove();
					if (document.getElementById("profileBannerUrlInput")) document.getElementById("profileBannerUrlInput").remove();
					if (document.getElementById("decorationButton")) document.getElementById("decorationButton").remove();
					if (document.getElementById("changeProfileEffectButton")) document.getElementById("changeProfileEffectButton").remove();
					if (document.getElementById("profilePictureUrlInput")) document.getElementById("profilePictureUrlInput").remove();
					if (document.getElementById("profilePictureButton")) document.getElementById("profilePictureButton").remove();
					BdApi.DOM.removeStyle(this.getName());
					BdApi.DOM.removeStyle("BDNitroBadges");
					BdApi.DOM.removeStyle("UsrBGIntegration");
					usrBgUsers = [];
				}
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
