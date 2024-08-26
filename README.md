# BDNitro

Probablemente, el mejor "complemento Nitro" que existe.

BDNitro es un complemento para BetterDiscord con muchas funciones, diseñado para mejorar tu experiencia en Discord. Este complemento ofrece varias funciones, como calidad de pantalla compartida personalizable, omisiones de emojis, acentos de perfil, temas de cliente y mucho más.

Enlace de archivo sin procesar: [BDNitro.plugin.js](https://raw.githubusercontent.com/srgobi/BDNitro/main/BDNitro.plugin.js)

## Tabla de contenido:

- [Características](#características)
- [Pantalla compartida personalizada, FPS, tasa de bits](#calidad-de-pantalla-compartida-completamente-personalizable-fps-y-tasa-de-bits)
- [Omisiones de emojis](#omisiones-de-emojis)
- [Cargar emoticones](#cargar-emoticones)
- [Modo fantasma](#modo-fantasma)
- [Modo clásico](#modo-clasico)
- [Perfil](#perfil)
- [Acentos de perfil para todos los usuarios](#acentos-de-perfil-para-todos-los-usuarios)
- [Temas de perfil falso](#temas-de-perfil-falso)
- [Perfil falso Banners](#fake-profile-banners)
- [Decoraciones de avatar falsas](#fake-avatar-decorations)
- [Efectos de perfil falso](#fake-profile-effects)
- [Imágenes de perfil falsas](#fake-profile-pictures)
- [Varios](#miscellaneous)
- [Temas de cliente de Nitro](#nitro-client-themes)
- [Eliminar la venta adicional de Screenshare Nitro](#remove-screenshare-nitro-upsell)
- [Preguntas frecuentes e instalación (¡lea esto antes de preguntar!)](#frequently-asked-questions)
- [Informar problemas](#reporting-issues)
- [Contribuir](#contributing)
- [Agradecimientos especiales](#contributors)
- [Complementos adicionales para recomendar](#complementos-adicionales-recomendados-para-más-funciones-de-nitro)
- [Acuerdo de licencia](#licencia)
- [Servidor de Discord](#servidor-de-discord)
- [Donar](#donar)

## Características

## Calidad de pantalla compartida, FPS y tasa de bits totalmente personalizables

¡Transmite en cualquier resolución, tasa de cuadros y tasa de bits que quieras! ¿Quién necesita Nitro?

![Elegir opciones de calidad y FPS](https://user-images.githubusercontent.com/54255074/176584683-efe8eac3-8c6c-4100-9b98-0b2592fbb86f.png)

![Otra imagen](https://user-images.githubusercontent.com/54255074/183275106-cbee28e6-d550-4637-ab06-0cb065c81283.png)

![Velocidad de bits Opciones](https://user-images.githubusercontent.com/54255074/191619975-64c61dc5-152a-4bec-995c-98661f823b53.png)

## Omisión de emojis

¡Te permite usar emojis animados y emojis de cualquier servidor en el que estés sin problemas al vincularlos o cargarlos!

### Cargar emoticones

¡Carga automáticamente los emojis utilizados en tu mensaje como archivo adjunto!

![Demostración de carga](https://user-images.githubusercontent.com/54255074/191621033-da0db3f6-c5f6-4ba7-9c99-0c8ccf7ed864.gif)

---

### Modo fantasma

<!-- ¡¡¡espeluznante!!! -->

¡Oculta los enlaces a cualquier emoji que envíes usando automáticamente un "mensaje fantasma"! Es un poco más lento y algunos bots pueden detectarlo como spam.

![Demostración de imagen del modo fantasma](https://user-images.githubusercontent.com/54255074/166120840-50bd98c7-48d0-4772-8d9b-17280e247a02.png)

---

### Modo clásico

Cuando tanto el modo fantasma como la carga de emoticones están deshabilitados, simplemente reemplazamos el emoji en el mensaje con su URL. Este es el "modo clásico".

---

#### Uso de Emoji Bypass

![Demostración de emoji](https://user-images.githubusercontent.com/54255074/166121643-58b06bc5-c0a5-4e45-a7e9-c135337b7ed0.gif)

## Perfil

### Acentos de perfil para todos los usuarios

<img src="https://user-images.githubusercontent.com/54255074/199860419-7e3275e0-fdf5-49cf-a7c3-89f3105d1867.png" alt="diferencia visual con él activado" width="25%"></img><--[Nuevo aspecto] [Aspecto original]--><img src="https://user-images.githubusercontent.com/54255074/199860495-19312500-3f37-4c3d-a54a-1c04af68e826.png" alt="diferencia visual con esta opción desactivada" width="25%"></img>

Para aclarar: lo que esto hace es que **todos los perfiles** se representen con el acento de degradado en el **lado del cliente**.

En un segundo, abordaremos los acentos de perfil que otros usuarios pueden ver.

---

### Temas de perfil falsos

Permite crear temas de perfil ocultando la información de color en tu biografía usando la codificación invisible 3y3.<br>
Funciona de manera efectiva exactamente igual que FakeProfileThemes en Vencord, ¡pero en BetterDiscord!<br>

¡Feliz creación de temas!

**Ten en cuenta que solo los usuarios que tengan instalado BDNitro, FakeProfileThemes (Vencord), UnrealProfileThemes (Enmity) o un complemento similar (que decodifica los colores de perfil codificados en 3y3) podrán ver los colores de perfil.**

---

### Banners de perfil falsos

Utiliza una codificación 3y3 invisible para permitir la configuración de banners de perfil ocultando la URL de la imagen en tu biografía.<br>
Solo admite URL de Imgur por razones de seguridad.

Para usar banners de perfil falsos, ve a Configuración>Perfiles. Deberías ver una nueva entrada de texto y el botón "Copiar 3y3" debajo de la sección Banners de perfil:

<br>
Simplemente escribe y pega una URL de Imgur en el área de entrada

(p. ej.: **`https://i.imgur.com/bYGGXnq.gif`** )

Luego, haz clic en el botón "Copiar 3y3" a la derecha del área de entrada, pega tu portapapeles en "Acerca de mí" (o biografía) y guarda.

El banner debería aparecer en la vista previa de "Pruébalo" para informarte que está funcionando correctamente.

**Ten en cuenta que solo otros usuarios con BDNitro instalado y habilitado podrán verlo.**

---

### Decoraciones de avatar falsas

Usa la codificación 3y3 invisible para permitir configurar decoraciones de avatar ocultando las identificaciones en tu biografía o estado personalizado.

Para usar decoraciones de avatar falsas, ve a Configuración>Perfiles y deberías ver un nuevo botón debajo de Decoración de avatar.

![deco-button](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/273400010-0b5547e0-2947-4628-a3da-a91f9ee1c933.png)

Al hacer clic en este botón, se mostrará un menú con cada una de las decoraciones del avatar en una cuadrícula.

![adornos de avatar](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/273400096-54597f3e-b115-44dd-9804-3aee5d9c99b3.gif)

Al hacer clic en uno de estos adornos de avatar, se copiarán los datos invisibles codificados en 3y3 en el portapapeles.
<br>Ahora sigue uno o ambos **(para obtener el mejor efecto, ¡haz ambos!)** de los siguientes métodos para aplicar la decoración del avatar a tu perfil:

<details>
<summary>
Estado personalizado
</summary>
Ahora que tienes los datos codificados en 3y3 en tu portapapeles:

Cierra la configuración presionando Escape o el botón ESC en la parte superior derecha.

Haz clic en tu perfil en la parte inferior izquierda para abrir este menú:

Haz clic en el botón para agregar/editar tu estado personalizado y pegar tu portapapeles en tu estado.

**Ten en cuenta que si solo utilizas el método de estado personalizado, este solo aparecerá para otros usuarios de BDNitro cuando estés en línea.**

¡Ahora deberías ver la decoración del avatar alrededor de tu foto de perfil!

</details>

<details>
<summary>
Acerca de mí / Biografía del perfil
</summary>
Ahora que tienes los datos codificados en 3y3 en tu portapapeles:
<br>Pega tu portapapeles en la sección Acerca de mí de tu perfil.

Demostración:

![demostración de decoración](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/273400196-b91fcd6e-389f-4adf-aa92-054d3e18d524.gif)

**Nota: Si la decoración de tu avatar está en la sección Acerca de mí de tu perfil, solo aparecerá para otros usuarios _después_ de que hayan abierto tu perfil al menos una vez.**

</details>

<br>
Cualquier otro usuario de BDNitro con decoraciones de avatar falsas habilitadas ahora podrá ver la decoración de tu avatar.

---

## Efectos de perfil falsos

Utiliza codificación 3y3 invisible para permitir la configuración de efectos de perfil ocultando identificaciones en tu biografía.

Para usar efectos de perfil falsos, primero ve a Configuración>Perfiles; Deberías ver una sección de Efectos de perfil:

![Sección de Efectos de perfil](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/275133445-2030de16-4bec-4e55-96be-916c9cfb8090.png)

Al hacer clic en el nuevo botón "Cambiar efecto \[BDNitro\]", debería aparecer un menú con todos los efectos de perfil disponibles:

![Sección de efectos de perfil abierta](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/275133643-20a4ee8d-afc6-4e78-a478-ded416172e56.png)
<br>(El menú se completará automáticamente con cualquier efecto de perfil nuevo que Discord pueda agregar en el futuro).

Al hacer clic en uno de estos efectos de perfil, se copiarán los datos invisibles codificados en 3y3 en el portapapeles.
<br>¡Ahora todo lo que tienes que hacer es pegar tu portapapeles en la sección "Acerca de mí" de tu perfil y hacer clic en Guardar cambios!

¡Cualquier otro usuario de BDNitro con Efectos de perfil falsos habilitados ahora podrá ver tu efecto de perfil!

---

## Fotos de perfil falsas

Utiliza la codificación 3y3 invisible para permitir la configuración de imágenes de perfil personalizadas ocultando la URL de una imagen en tu estado.
<br>Solo admite URL de Imgur por razones de seguridad.

Para usar imágenes de perfil falsas, primero ve a Configuración>Perfiles; Deberías ver una nueva entrada y un botón:

![sección de configuración de pfp falsa](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/278837453-99adab5d-5d69-4e1d-ae84-f094b2cb782e.png)

Ahora pega una URL de Imgur (por ejemplo: `https://i.imgur.com/bYGGXnq.gif`) en el cuadro y haz clic en "Copiar 3y3" a la derecha.

![demostración de pfp falsa](https://github-production-user-asset-6210df.s3.amazonaws.com/54255074/278837505-a7aba7b6-f947-4b2a-b2c2-696692ce7abc.gif)

Suponiendo que nada salga mal, deberías ver "¡3y3 copiado al portapapeles!" aparecer en la parte inferior de la ventana.

Ahora, cierra Configuración y haz clic en tu perfil en la parte inferior izquierda de la ventana.

Elige la opción para configurar tu estado personalizado y pega tu portapapeles en cualquier lugar de tu estado personalizado.

¡Ahora deberías ver que tu foto de perfil cambia a la imagen deseada!

Ten en cuenta que solo otras personas del complemento podrán ver tu foto de perfil falsa.

**Nota: Debido a que esto usa un estado personalizado, debes aparecer en línea, inactivo o no molestar para que esto funcione.**

---

## Varios

### Temas del cliente Nitro

Te permite usar los temas de cliente de gradiente exclusivos de Nitro de Discord.

![Opciones del tema del cliente Nitro](https://user-images.githubusercontent.com/54255074/233231021-16c06b12-530a-4878-8ee9-60a5a254dd1b.png)

---

### Eliminar la venta adicional de Nitro para compartir pantalla

Elimina la molesta venta adicional de Nitro en el menú de calidad para compartir pantalla.

# Preguntas frecuentes

[¡Vaya aquí para ver las preguntas frecuentes y las instrucciones de instalación!](https://github.com/srgobi/BDNitro/issues/76)

Si su pregunta no está ahí **y cree que debería estar ahí,** escriba un comentario debajo de esa pregunta.

Si tiene otras preguntas, puede enviarme un mensaje directo si lo desea, de lo contrario puede [crear una nueva pregunta](https://github.com/srgobi/BDNitro/issues/new)
con su pregunta, e intentaré responderla lo mejor que pueda.

## Informar de problemas

Para informar de un problema, abra una nueva pregunta en la [página de problemas](https://github.com/BDNitro/BDNitro/issues)
de este repositorio de GitHub con una descripción clara del problema y los pasos para reproducirlo.

## Contribuir

Si desea contribuir al proyecto, existen varias formas de hacerlo. Puede:

- Enviar un informe de error o una solicitud de función
- Bifurcar el repositorio y realizar cambios
- Enviar una solicitud de incorporación de cambios para fusionar sus cambios nuevamente en la rama principal

¡Gracias por su interés en contribuir con BDNitro!

## Colaboradores

¡Las contribuciones significativas al complemento le permitirán ganar una **insignia de colaborador de BDNitro** especial (de la que podrá presumir ante sus amigos)!

¡Muchas gracias a todos por el esfuerzo que hicieron para que este complemento fuera genial!

## Complementos adicionales recomendados para más funciones de Nitro

[FreeStickers de An00nymushun](https://github.com/srgobi/DiscordFreeStickers) - Se desbloqueó el envío de stickers mediante la conversión y carga como GIF. (La bifurcación corregida está vinculada hasta que se arregle el [repositorio original](https://github.com/An00nymushun/DiscordFreeStickers))

[SplitLargeMessages de DevilBro](https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/SplitLargeMessages) - ¡Envía mensajes más largos!

[SplitLargeFiles de ImTheSquid](https://github.com/srgobi/SplitLargeFiles) - ¡Envía archivos grandes dividiéndolos en fragmentos de 25 megabytes! Bifurcación compatible con BDNitro creada por mí.

## Licencia

El complemento tiene licencia NPOSL versión 3. Puedes encontrarla [aquí](https://github.com/srgobi/BDNitro/blob/main/LICENSE.md).

Este software se proporciona "TAL CUAL" y SIN GARANTÍA, ya sea expresa o implícita, incluidas, entre otras, las garantías de no infracción, comerciabilidad o idoneidad para un fin determinado. USTED ASUME TODO EL RIESGO EN CUANTO A LA CALIDAD DE ESTE SOFTWARE. Esta EXENCIÓN DE GARANTÍA constituye una parte esencial de esta Licencia. Esta Licencia no otorga ninguna licencia sobre la Obra original, excepto en virtud de esta exención de responsabilidad.