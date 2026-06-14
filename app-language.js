(() => {
  const STORAGE_KEY = "tunewaveLanguage";
  const SUPPORTED = {
    en: { label: "English", locale: "en-US", lang: "en" },
    hi: { label: "Hindi", locale: "hi-IN", lang: "hi" },
    es: { label: "Spanish", locale: "es-ES", lang: "es" },
    te: { label: "Telugu", locale: "te-IN", lang: "te" },
    ta: { label: "Tamil", locale: "ta-IN", lang: "ta" },
    mr: { label: "Marathi", locale: "mr-IN", lang: "mr" },
    pa: { label: "Punjabi", locale: "pa-IN", lang: "pa" },
    ru: { label: "Russian", locale: "ru-RU", lang: "ru" },
    fr: { label: "French", locale: "fr-FR", lang: "fr" }
  };

  const EXACT = {
    hi: {
      "Home": "होम",
      "Playlist": "प्लेलिस्ट",
      "Artist": "आर्टिस्ट",
      "Downloads": "डाउनलोड्स",
      "Your Library": "आपकी लाइब्रेरी",
      "Upload Songs": "गाने अपलोड करें",
      "Buy Membership": "मेंबरशिप खरीदें",
      "Settings": "सेटिंग्स",
      "Profile": "प्रोफाइल",
      "Switch Account": "अकाउंट बदलें",
      "Discover mixes": "मिक्स खोजें",
      "Curated queue": "क्यूरेटेड कतार",
      "Popular creators": "लोकप्रिय क्रिएटर्स",
      "Saved offline": "ऑफलाइन सेव",
      "Recently played": "हाल ही में बजाए गए",
      "Add your tracks": "अपने ट्रैक जोड़ें",
      "Unlock premium": "प्रीमियम अनलॉक करें",
      "Theme and profile": "थीम और प्रोफाइल",
      "Profile and theme": "प्रोफाइल और थीम",
      "Personal details": "व्यक्तिगत विवरण",
      "Return to login": "लॉगिन पर वापस जाएं",
      "Music dashboard": "म्यूजिक डैशबोर्ड",
      "Offline downloads": "ऑफलाइन डाउनलोड्स",
      "Premium access": "प्रीमियम एक्सेस",
      "Your profile": "आपकी प्रोफाइल",
      "Personalize the app": "ऐप को अपने अनुसार बनाएं",
      "Fresh Today": "आज का ताज़ा मूड",
      "Offline Zone": "ऑफलाइन ज़ोन",
      "Premium Membership": "प्रीमियम मेंबरशिप",
      "Profile Center": "प्रोफाइल सेंटर",
      "Quick Search": "क्विक सर्च",
      "Search songs": "गाने खोजें",
      "Search tracks": "ट्रैक खोजें",
      "Search and filter": "खोजें और फ़िल्टर करें",
      "Quick Stats": "क्विक स्टैट्स",
      "Download health": "डाउनलोड हेल्थ",
      "Saved Tracks": "सेव किए गए ट्रैक",
      "Your download list": "आपकी डाउनलोड सूची",
      "Play All": "सभी चलाएं",
      "All": "सभी",
      "Completed": "पूर्ण",
      "Queued": "कतार में",
      "High quality": "हाई क्वालिटी",
      "songs downloaded": "डाउनलोड किए गए गाने",
      "total play time": "कुल प्ले समय",
      "queued": "कतार में",
      "Curated Atmosphere": "क्यूरेटेड माहौल",
      "Find the right mood faster.": "सही मूड जल्दी खोजें।",
      "Open Playlist": "प्लेलिस्ट खोलें",
      "Weather sync": "मौसम सिंक",
      "Match the mood outside": "बाहर के मूड से मिलाएं",
      "Enter city": "शहर दर्ज करें",
      "Check": "जांचें",
      "Trending now": "अभी ट्रेंडिंग",
      "Featured tracks": "फीचर्ड ट्रैक्स",
      "Your choice": "आपकी पसंद",
      "Recommended for you": "आपके लिए सुझाव",
      "Listener profile": "लिस्नर प्रोफाइल",
      "Preview only": "सिर्फ प्रीव्यू",
      "Available plans": "उपलब्ध प्लान",
      "Quick answers": "झटपट जवाब",
      "Offer terms": "ऑफर शर्तें",
      "Why go Premium": "प्रीमियम क्यों लें",
      "Person details": "व्यक्ति विवरण",
      "Payment mode": "भुगतान तरीका",
      "Coupon code": "कूपन कोड",
      "Apply discount code": "डिस्काउंट कोड लगाएं",
      "Apply": "लगाएं",
      "Plan total": "प्लान कुल",
      "Discount": "छूट",
      "Amount to pay": "देय राशि",
      "Proceed to Pay": "भुगतान आगे बढ़ाएं",
      "Back to plans": "प्लान पर वापस जाएं",
      "Secure checkout": "सुरक्षित चेकआउट",
      "Subscription checkout": "सब्सक्रिप्शन चेकआउट",
      "Selected plan": "चुना गया प्लान",
      "UPI": "यूपीआई",
      "Net Banking": "नेट बैंकिंग",
      "Credit Card": "क्रेडिट कार्ड",
      "Debit Card": "डेबिट कार्ड",
      "Vouchers": "वाउचर",
      "Full name": "पूरा नाम",
      "Email address": "ईमेल पता",
      "Phone number": "फोन नंबर",
      "City": "शहर",
      "Billing address": "बिलिंग पता",
      "Your subscription profile": "आपकी सब्सक्रिप्शन प्रोफाइल",
      "Choose how you want to pay": "भुगतान का तरीका चुनें",
      "Change Photo": "फोटो बदलें",
      "Save Profile": "प्रोफाइल सेव करें",
      "Display name": "डिस्प्ले नाम",
      "Email": "ईमेल",
      "Preview": "प्रीव्यू",
      "Live settings snapshot": "लाइव सेटिंग्स स्नैपशॉट",
      "Look and feel": "लुक और फील",
      "Audio profile": "ऑडियो प्रोफाइल",
      "Session guard": "सेशन सुरक्षा",
      "Appearance": "दिखावट",
      "Theme and layout": "थीम और लेआउट",
      "Playback": "प्लेबैक",
      "Listening behavior": "सुनने का व्यवहार",
      "Audio Lab": "ऑडियो लैब",
      "Sound tuning": "साउंड ट्यूनिंग",
      "Notifications": "नोटिफिकेशन",
      "Stay in the loop": "अपडेट में रहें",
      "Accessibility": "एक्सेसिबिलिटी",
      "Comfort and readability": "आराम और पठनीयता",
      "Personalization": "पर्सनलाइजेशन",
      "Recommendations and mood": "सुझाव और मूड",
      "Social": "सोशल",
      "Sharing and collaboration": "शेयरिंग और सहयोग",
      "Privacy": "प्राइवेसी",
      "Account control": "अकाउंट कंट्रोल",
      "Security": "सुरक्षा",
      "Session and account safety": "सेशन और अकाउंट सुरक्षा",
      "Devices": "डिवाइसेस",
      "Connectivity and output": "कनेक्टिविटी और आउटपुट",
      "Library": "लाइब्रेरी",
      "Downloads and storage": "डाउनलोड्स और स्टोरेज",
      "Wellness": "वेलनेस",
      "Focus and habits": "फोकस और आदतें",
      "Data": "डेटा",
      "Storage and reset": "स्टोरेज और रीसेट",
      "Account": "अकाउंट",
      "Quick actions": "क्विक एक्शंस",
      "Theme": "थीम",
      "Start page": "शुरुआती पेज",
      "Language": "भाषा",
      "Dark": "डार्क",
      "Light": "लाइट",
      "Autoplay": "ऑटोप्ले",
      "High quality audio": "हाई क्वालिटी ऑडियो",
      "Default volume": "डिफॉल्ट वॉल्यूम",
      "Crossfade": "क्रॉसफेड",
      "Sleep timer": "स्लीप टाइमर",
      "EQ preset": "ईक्यू प्रीसेट",
      "Bass boost": "बास बूस्ट",
      "Mono audio": "मोनो ऑडियो",
      "Normalize volume": "वॉल्यूम सामान्य करें",
      "Push updates": "पुश अपडेट्स",
      "Email digest": "ईमेल डाइजेस्ट",
      "Notification frequency": "नोटिफिकेशन फ्रीक्वेंसी",
      "Reduce motion": "मोशन कम करें",
      "Large text mode": "बड़ा टेक्स्ट मोड",
      "Interface density": "इंटरफेस डेंसिटी",
      "Favorite genre": "पसंदीदा शैली",
      "Discovery mode": "डिस्कवरी मोड",
      "Custom welcome note": "कस्टम वेलकम नोट",
      "Friend activity": "फ्रेंड एक्टिविटी",
      "Collaborative playlists": "कोलैबोरेटिव प्लेलिस्ट्स",
      "Profile accent": "प्रोफाइल एक्सेंट",
      "Private account": "प्राइवेट अकाउंट",
      "Show listening activity": "लिस्निंग एक्टिविटी दिखाएं",
      "Explicit content": "एक्सप्लिसिट कंटेंट",
      "Version": "वर्जन",
      "Confirm before sign out": "साइन आउट से पहले पुष्टि करें",
      "Remember this device": "इस डिवाइस को याद रखें",
      "Session timeout": "सेशन टाइमआउट",
      "Preferred output": "पसंदीदा आउटपुट",
      "Streaming mode": "स्ट्रीमिंग मोड",
      "Wi-Fi only sync": "सिर्फ वाई-फाई सिंक",
      "Smart downloads": "स्मार्ट डाउनलोड्स",
      "Download quality": "डाउनलोड क्वालिटी",
      "Storage used": "प्रयुक्त स्टोरेज",
      "Focus mode": "फोकस मोड",
      "Break reminder": "ब्रेक रिमाइंडर",
      "Home mood": "होम मूड",
      "Local playlists": "लोकल प्लेलिस्ट्स",
      "Reset interface": "इंटरफेस रीसेट करें",
      "Reset": "रीसेट",
      "Export profile summary": "प्रोफाइल सारांश एक्सपोर्ट करें",
      "Export": "एक्सपोर्ट",
      "Sign out": "साइन आउट",
      "Mini": "मिनी",
      "Yearly": "ईयरली",
      "Individual": "इंडिविजुअल",
      "Student": "स्टूडेंट",
      "Family": "फैमिली",
      "Most Popular": "सबसे लोकप्रिय",
      "Choose Mini": "मिनी चुनें",
      "Get Yearly": "ईयरली लें",
      "Get Individual": "इंडिविजुअल लें",
      "Get Student": "स्टूडेंट लें",
      "Get Family": "फैमिली लें",
      "Log In": "लॉग इन",
      "Create Account": "अकाउंट बनाएं",
      "Password": "पासवर्ड",
      "Confirm password": "पासवर्ड की पुष्टि करें",
      "Forgot password?": "पासवर्ड भूल गए?",
      "Keep me signed in": "मुझे साइन इन रखें",
      "Open Home": "होम खोलें",
      "Username": "यूज़रनेम",
      "Email id": "ईमेल आईडी",
      "Plan purchased": "खरीदा गया प्लान",
      "Gender": "जेंडर",
      "Country": "देश",
      "Date of birth": "जन्म तिथि",
      "Member since": "कब से सदस्य",
      "Favorite genres": "पसंदीदा शैलियां",
      "Listening vibe": "सुनने का मूड",
      "Devices used": "उपयोग किए गए डिवाइस",
      "About you": "आपके बारे में",
      "Your playlist page is now frontend-only. Save logic can move into Java/MySQL next.": "",
      "Smart Experience": "स्मार्ट एक्सपीरियंस",
      "Automation and assist": "ऑटोमेशन और सहायता",
      "App region": "ऐप क्षेत्र",
      "Translate lyrics automatically": "गीत स्वतः अनुवाद करें",
      "Smart resume": "स्मार्ट रिज्यूम",
      "Keyboard shortcuts": "कीबोर्ड शॉर्टकट्स",
      "Voice assistant language": "वॉइस असिस्टेंट भाषा",
      "Like": "पसंद",
      "Liked": "पसंद किया गया",
      "Play now": "अभी चलाएं",
      "English": "अंग्रेज़ी",
      "Hindi": "हिंदी",
      "Spanish": "स्पेनिश",
      "India": "भारत",
      "Global": "ग्लोबल",
      "Match app language": "ऐप भाषा जैसी",
      "Balanced": "संतुलित",
      "Calm": "शांत",
      "Night": "रात",
      "Headphones": "हेडफोन्स",
      "theme": "थीम",
      "volume": "वॉल्यूम",
      "with": "के साथ",
      "without": "के बिना",
      "Interface refresh complete": "इंटरफेस रिफ्रेश पूरा",
      "Profile and theme settings now persist locally.": "प्रोफाइल और थीम सेटिंग्स अब स्थानीय रूप से सेव रहती हैं।",
      "Loading date": "तारीख लोड हो रही है",
      "Search downloaded tracks or artists": "डाउनलोड किए गए ट्रैक्स या आर्टिस्ट खोजें",
      "Search artists, tracks, moods": "आर्टिस्ट, ट्रैक, मूड खोजें",
      "Enter coupon code": "कूपन कोड दर्ज करें",
      "Enter your full name": "अपना पूरा नाम दर्ज करें",
      "Enter your email id": "अपना ईमेल आईडी दर्ज करें",
      "Enter your phone number": "अपना फोन नंबर दर्ज करें",
      "Enter your city": "अपना शहर दर्ज करें",
      "Enter your billing address": "अपना बिलिंग पता दर्ज करें"
    },
    es: {
      "Home": "Inicio",
      "Playlist": "Lista",
      "Artist": "Artista",
      "Downloads": "Descargas",
      "Your Library": "Tu biblioteca",
      "Upload Songs": "Subir canciones",
      "Buy Membership": "Comprar membresia",
      "Settings": "Configuracion",
      "Profile": "Perfil",
      "Switch Account": "Cambiar cuenta",
      "Discover mixes": "Descubre mezclas",
      "Curated queue": "Cola curada",
      "Popular creators": "Creadores populares",
      "Saved offline": "Guardado sin conexion",
      "Recently played": "Reproducido recientemente",
      "Add your tracks": "Agrega tus pistas",
      "Unlock premium": "Desbloquear premium",
      "Theme and profile": "Tema y perfil",
      "Profile and theme": "Perfil y tema",
      "Personal details": "Detalles personales",
      "Return to login": "Volver al inicio de sesion",
      "Music dashboard": "Panel musical",
      "Offline downloads": "Descargas sin conexion",
      "Premium access": "Acceso premium",
      "Your profile": "Tu perfil",
      "Personalize the app": "Personaliza la app",
      "Fresh Today": "Hoy fresco",
      "Offline Zone": "Zona sin conexion",
      "Premium Membership": "Membresia premium",
      "Profile Center": "Centro de perfil",
      "Quick Search": "Busqueda rapida",
      "Search songs": "Buscar canciones",
      "Search tracks": "Buscar pistas",
      "Search and filter": "Buscar y filtrar",
      "Quick Stats": "Estadisticas rapidas",
      "Download health": "Estado de descargas",
      "Saved Tracks": "Pistas guardadas",
      "Your download list": "Tu lista de descargas",
      "Play All": "Reproducir todo",
      "All": "Todo",
      "Completed": "Completado",
      "Queued": "En cola",
      "High quality": "Alta calidad",
      "songs downloaded": "canciones descargadas",
      "total play time": "tiempo total",
      "queued": "en cola",
      "Curated Atmosphere": "Atmosfera curada",
      "Find the right mood faster.": "Encuentra el ambiente correcto mas rapido.",
      "Open Playlist": "Abrir lista",
      "Weather sync": "Sincronizacion del clima",
      "Match the mood outside": "Combina con el ambiente exterior",
      "Enter city": "Ingresa ciudad",
      "Check": "Verificar",
      "Trending now": "Tendencia ahora",
      "Featured tracks": "Pistas destacadas",
      "Your choice": "Tu eleccion",
      "Recommended for you": "Recomendado para ti",
      "Listener profile": "Perfil del oyente",
      "Preview only": "Solo vista previa",
      "Available plans": "Planes disponibles",
      "Quick answers": "Respuestas rapidas",
      "Offer terms": "Terminos de la oferta",
      "Why go Premium": "Por que elegir Premium",
      "Person details": "Datos personales",
      "Payment mode": "Metodo de pago",
      "Coupon code": "Codigo de cupon",
      "Apply discount code": "Aplicar codigo de descuento",
      "Apply": "Aplicar",
      "Plan total": "Total del plan",
      "Discount": "Descuento",
      "Amount to pay": "Monto a pagar",
      "Proceed to Pay": "Proceder al pago",
      "Back to plans": "Volver a planes",
      "Secure checkout": "Pago seguro",
      "Subscription checkout": "Pago de suscripcion",
      "Selected plan": "Plan seleccionado",
      "UPI": "UPI",
      "Net Banking": "Banca en linea",
      "Credit Card": "Tarjeta de credito",
      "Debit Card": "Tarjeta de debito",
      "Vouchers": "Vales",
      "Full name": "Nombre completo",
      "Email address": "Correo electronico",
      "Phone number": "Numero de telefono",
      "City": "Ciudad",
      "Billing address": "Direccion de facturacion",
      "Your subscription profile": "Tu perfil de suscripcion",
      "Choose how you want to pay": "Elige como quieres pagar",
      "Change Photo": "Cambiar foto",
      "Save Profile": "Guardar perfil",
      "Display name": "Nombre visible",
      "Email": "Correo",
      "Preview": "Vista previa",
      "Live settings snapshot": "Vista en vivo de ajustes",
      "Look and feel": "Apariencia",
      "Audio profile": "Perfil de audio",
      "Session guard": "Proteccion de sesion",
      "Appearance": "Apariencia",
      "Theme and layout": "Tema y diseno",
      "Playback": "Reproduccion",
      "Listening behavior": "Comportamiento de escucha",
      "Audio Lab": "Laboratorio de audio",
      "Sound tuning": "Ajuste de sonido",
      "Notifications": "Notificaciones",
      "Stay in the loop": "Mantente al tanto",
      "Accessibility": "Accesibilidad",
      "Comfort and readability": "Comodidad y lectura",
      "Personalization": "Personalizacion",
      "Recommendations and mood": "Recomendaciones y ambiente",
      "Social": "Social",
      "Sharing and collaboration": "Compartir y colaborar",
      "Privacy": "Privacidad",
      "Account control": "Control de cuenta",
      "Security": "Seguridad",
      "Session and account safety": "Seguridad de sesion y cuenta",
      "Devices": "Dispositivos",
      "Connectivity and output": "Conectividad y salida",
      "Library": "Biblioteca",
      "Downloads and storage": "Descargas y almacenamiento",
      "Wellness": "Bienestar",
      "Focus and habits": "Enfoque y habitos",
      "Data": "Datos",
      "Storage and reset": "Almacenamiento y reinicio",
      "Account": "Cuenta",
      "Quick actions": "Acciones rapidas",
      "Theme": "Tema",
      "Start page": "Pagina inicial",
      "Language": "Idioma",
      "Dark": "Oscuro",
      "Light": "Claro",
      "Autoplay": "Reproduccion automatica",
      "High quality audio": "Audio de alta calidad",
      "Default volume": "Volumen predeterminado",
      "Crossfade": "Transicion",
      "Sleep timer": "Temporizador",
      "EQ preset": "Preajuste EQ",
      "Bass boost": "Refuerzo de bajos",
      "Mono audio": "Audio mono",
      "Normalize volume": "Normalizar volumen",
      "Push updates": "Avisos push",
      "Email digest": "Resumen por correo",
      "Notification frequency": "Frecuencia de notificaciones",
      "Reduce motion": "Reducir movimiento",
      "Large text mode": "Modo de texto grande",
      "Interface density": "Densidad de interfaz",
      "Favorite genre": "Genero favorito",
      "Discovery mode": "Modo descubrimiento",
      "Custom welcome note": "Nota de bienvenida",
      "Friend activity": "Actividad de amigos",
      "Collaborative playlists": "Listas colaborativas",
      "Profile accent": "Acento del perfil",
      "Private account": "Cuenta privada",
      "Show listening activity": "Mostrar actividad",
      "Explicit content": "Contenido explicito",
      "Version": "Version",
      "Confirm before sign out": "Confirmar antes de salir",
      "Remember this device": "Recordar este dispositivo",
      "Session timeout": "Tiempo de sesion",
      "Preferred output": "Salida preferida",
      "Streaming mode": "Modo de streaming",
      "Wi-Fi only sync": "Sincronizar solo por Wi-Fi",
      "Smart downloads": "Descargas inteligentes",
      "Download quality": "Calidad de descarga",
      "Storage used": "Almacenamiento usado",
      "Focus mode": "Modo enfoque",
      "Break reminder": "Recordatorio de descanso",
      "Home mood": "Ambiente de inicio",
      "Local playlists": "Listas locales",
      "Reset interface": "Restablecer interfaz",
      "Reset": "Restablecer",
      "Export profile summary": "Exportar resumen del perfil",
      "Export": "Exportar",
      "Sign out": "Cerrar sesion",
      "Mini": "Mini",
      "Yearly": "Anual",
      "Individual": "Individual",
      "Student": "Estudiante",
      "Family": "Familiar",
      "Most Popular": "Mas popular",
      "Choose Mini": "Elegir Mini",
      "Get Yearly": "Obtener Anual",
      "Get Individual": "Obtener Individual",
      "Get Student": "Obtener Estudiante",
      "Get Family": "Obtener Familiar",
      "Log In": "Iniciar sesion",
      "Create Account": "Crear cuenta",
      "Password": "Contrasena",
      "Confirm password": "Confirmar contrasena",
      "Forgot password?": "Olvidaste tu contrasena?",
      "Keep me signed in": "Mantener sesion iniciada",
      "Open Home": "Abrir inicio",
      "Username": "Nombre de usuario",
      "Email id": "Correo",
      "Plan purchased": "Plan comprado",
      "Gender": "Genero",
      "Country": "Pais",
      "Date of birth": "Fecha de nacimiento",
      "Member since": "Miembro desde",
      "Favorite genres": "Generos favoritos",
      "Listening vibe": "Vibra musical",
      "Devices used": "Dispositivos usados",
      "About you": "Sobre ti",
      "Your playlist page is now frontend-only. Save logic can move into Java/MySQL next.": "",
      "Smart Experience": "Experiencia inteligente",
      "Automation and assist": "Automatizacion y ayuda",
      "App region": "Region de la app",
      "Translate lyrics automatically": "Traducir letras automaticamente",
      "Smart resume": "Reanudacion inteligente",
      "Keyboard shortcuts": "Atajos de teclado",
      "Voice assistant language": "Idioma del asistente de voz",
      "Like": "Me gusta",
      "Liked": "Te gusto",
      "Play now": "Reproducir ahora",
      "English": "Ingles",
      "Hindi": "Hindi",
      "Spanish": "Espanol",
      "India": "India",
      "Global": "Global",
      "Match app language": "Igual que la app",
      "Balanced": "Equilibrado",
      "Calm": "Calma",
      "Night": "Noche",
      "Headphones": "Auriculares",
      "theme": "tema",
      "volume": "volumen",
      "with": "con",
      "without": "sin",
      "Interface refresh complete": "Actualizacion de interfaz completa",
      "Profile and theme settings now persist locally.": "Los ajustes de perfil y tema ahora se guardan localmente.",
      "Loading date": "Cargando fecha",
      "Search downloaded tracks or artists": "Buscar pistas o artistas descargados",
      "Search artists, tracks, moods": "Buscar artistas, pistas o estados de animo",
      "Enter coupon code": "Ingresa codigo de cupon",
      "Enter your full name": "Ingresa tu nombre completo",
      "Enter your email id": "Ingresa tu correo",
      "Enter your phone number": "Ingresa tu numero",
      "Enter your city": "Ingresa tu ciudad",
      "Enter your billing address": "Ingresa tu direccion"
    }
  };

  const KEYED = {
    en: {
      "home.todayLabel": "Curated sounds for {weekday}.",
      "membership.todayLabel": "",
      "downloads.todayLabel": "",
      "settings.todayLabelDefault": "",
      "settings.profileUpdated": "Settings updated.",
      "settings.profileSaved": "Settings saved.",
      "profile.photoReady": "Photo is ready. Save profile to use it across all pages.",
      "profile.saved": "Profile saved for this session."
    },
    hi: {
      "home.todayLabel": "{weekday} के लिए क्यूरेटेड साउंड्स।",
      "membership.todayLabel": "",
      "downloads.todayLabel": "",
      "settings.todayLabelDefault": "",
      "settings.profileUpdated": "सेटिंग्स अपडेट हो गईं।",
      "settings.profileSaved": "सेटिंग्स सेव हो गईं।",
      "profile.photoReady": "फोटो प्रीव्यू तैयार है। इसे सभी पेजों पर उपयोग करने के लिए प्रोफाइल सेव करें।",
      "profile.saved": "प्रोफाइल इस सेशन के लिए सेव हो गया।"
    },
    es: {
      "home.todayLabel": "Sonidos seleccionados para {weekday}.",
      "membership.todayLabel": "",
      "downloads.todayLabel": "",
      "settings.todayLabelDefault": "",
      "settings.profileUpdated": "Ajustes actualizados.",
      "settings.profileSaved": "Ajustes guardados.",
      "profile.photoReady": "La vista previa de la foto esta lista. Guarda el perfil para usarla en todas las paginas.",
      "profile.saved": "Perfil guardado para esta sesion."
    }
  };

  const COMMON_TRANSLATIONS = {
    te: {
      "Home": "హోమ్",
      "Playlist": "ప్లేలిస్ట్",
      "Artist": "ఆర్టిస్ట్",
      "Downloads": "డౌన్‌లోడ్స్",
      "Your Library": "మీ లైబ్రరీ",
      "Upload Songs": "పాటలు అప్‌లోడ్ చేయండి",
      "Buy Membership": "మెంబర్‌షిప్ కొనండి",
      "Settings": "సెట్టింగ్స్",
      "Profile": "ప్రొఫైల్",
      "Switch Account": "అకౌంట్ మార్చండి",
      "Discover mixes": "మిక్స్‌లు కనుగొనండి",
      "Curated queue": "ఎంచుకున్న క్యూ",
      "Popular creators": "ప్రముఖ సృష్టికర్తలు",
      "Saved offline": "ఆఫ్‌లైన్‌లో సేవ్ చేయబడింది",
      "Recently played": "ఇటీవల ప్లే చేసినవి",
      "Unlock premium": "ప్రీమియం అన్‌లాక్ చేయండి",
      "Theme and profile": "థీమ్ మరియు ప్రొఫైల్",
      "Return to login": "లాగిన్‌కు తిరిగి వెళ్ళండి",
      "Language": "భాష",
      "English": "ఇంగ్లీష్",
      "Hindi": "హిందీ",
      "Spanish": "స్పానిష్",
      "Telugu": "తెలుగు",
      "Tamil": "తమిళం",
      "Marathi": "మరాఠీ",
      "Punjabi": "పంజాబీ",
      "Russian": "రష్యన్",
      "French": "ఫ్రెంచ్",
      "Play All": "అన్నీ ప్లే చేయండి",
      "Search songs": "పాటలు వెతకండి",
      "Search tracks": "ట్రాక్‌లు వెతకండి",
      "Search and filter": "వెతకండి మరియు ఫిల్టర్ చేయండి",
      "Quick Stats": "త్వరిత గణాంకాలు",
      "Download health": "డౌన్‌లోడ్ స్థితి",
      "Payment mode": "చెల్లింపు విధానం",
      "Settings are preview-only until your Java/MySQL backend is connected.": ""
    },
    ta: {
      "Home": "முகப்பு",
      "Playlist": "ப்ளேலிஸ்ட்",
      "Artist": "கலைஞர்",
      "Downloads": "பதிவிறக்கங்கள்",
      "Your Library": "உங்கள் நூலகம்",
      "Upload Songs": "பாடல்கள் பதிவேற்றம்",
      "Buy Membership": "உறுப்பினர் திட்டம் வாங்கவும்",
      "Settings": "அமைப்புகள்",
      "Profile": "சுயவிவரம்",
      "Switch Account": "கணக்கை மாற்று",
      "Discover mixes": "மிக்ஸ்களை கண்டுபிடி",
      "Curated queue": "தேர்ந்தெடுத்த வரிசை",
      "Popular creators": "பிரபல படைப்பாளர்கள்",
      "Saved offline": "ஆஃப்லைனில் சேமிக்கப்பட்டது",
      "Recently played": "சமீபத்தில் இயக்கப்பட்டது",
      "Unlock premium": "பிரீமியம் திறக்கவும்",
      "Theme and profile": "தீம் மற்றும் சுயவிவரம்",
      "Return to login": "உள்நுழைவுக்கு திரும்பு",
      "Language": "மொழி",
      "English": "ஆங்கிலம்",
      "Hindi": "இந்தி",
      "Spanish": "ஸ்பானிஷ்",
      "Telugu": "தெலுங்கு",
      "Tamil": "தமிழ்",
      "Marathi": "மராத்தி",
      "Punjabi": "பஞ்சாபி",
      "Russian": "ரஷ்யன்",
      "French": "பிரெஞ்சு",
      "Play All": "அனைத்தையும் இயக்கு",
      "Search songs": "பாடல்கள் தேடு",
      "Search tracks": "பாடல் தடங்கள் தேடு",
      "Search and filter": "தேடவும் வடிகட்டவும்",
      "Quick Stats": "விரைவு புள்ளிவிவரங்கள்",
      "Download health": "பதிவிறக்க நிலை",
      "Payment mode": "கட்டண முறை"
    },
    mr: {
      "Home": "होम",
      "Playlist": "प्लेलिस्ट",
      "Artist": "कलाकार",
      "Downloads": "डाउनलोड्स",
      "Your Library": "तुमची लायब्ररी",
      "Upload Songs": "गाणी अपलोड करा",
      "Buy Membership": "मेंबरशिप घ्या",
      "Settings": "सेटिंग्स",
      "Profile": "प्रोफाइल",
      "Switch Account": "अकाउंट बदला",
      "Language": "भाषा",
      "English": "इंग्रजी",
      "Hindi": "हिंदी",
      "Spanish": "स्पॅनिश",
      "Telugu": "तेलुगू",
      "Tamil": "तामिळ",
      "Marathi": "मराठी",
      "Punjabi": "पंजाबी",
      "Russian": "रशियन",
      "French": "फ्रेंच",
      "Play All": "सर्व प्ले करा",
      "Search songs": "गाणी शोधा",
      "Payment mode": "पेमेंट मोड"
    },
    pa: {
      "Home": "ਹੋਮ",
      "Playlist": "ਪਲੇਲਿਸਟ",
      "Artist": "ਆਰਟਿਸਟ",
      "Downloads": "ਡਾਊਨਲੋਡਸ",
      "Your Library": "ਤੁਹਾਡੀ ਲਾਇਬ੍ਰੇਰੀ",
      "Upload Songs": "ਗੀਤ ਅੱਪਲੋਡ ਕਰੋ",
      "Buy Membership": "ਮੈਂਬਰਸ਼ਿਪ ਖਰੀਦੋ",
      "Settings": "ਸੈਟਿੰਗਜ਼",
      "Profile": "ਪ੍ਰੋਫਾਈਲ",
      "Switch Account": "ਅਕਾਊਂਟ ਬਦਲੋ",
      "Language": "ਭਾਸ਼ਾ",
      "English": "ਅੰਗਰੇਜ਼ੀ",
      "Hindi": "ਹਿੰਦੀ",
      "Spanish": "ਸਪੈਨਿਸ਼",
      "Telugu": "ਤੇਲਗੂ",
      "Tamil": "ਤਾਮਿਲ",
      "Marathi": "ਮਰਾਠੀ",
      "Punjabi": "ਪੰਜਾਬੀ",
      "Russian": "ਰੂਸੀ",
      "French": "ਫ੍ਰੈਂਚ",
      "Play All": "ਸਭ ਚਲਾਓ",
      "Search songs": "ਗੀਤ ਖੋਜੋ",
      "Payment mode": "ਭੁਗਤਾਨ ਢੰਗ"
    },
    ru: {
      "Home": "Главная",
      "Playlist": "Плейлист",
      "Artist": "Артист",
      "Downloads": "Загрузки",
      "Your Library": "Ваша библиотека",
      "Upload Songs": "Загрузить песни",
      "Buy Membership": "Купить подписку",
      "Settings": "Настройки",
      "Profile": "Профиль",
      "Switch Account": "Сменить аккаунт",
      "Language": "Язык",
      "English": "Английский",
      "Hindi": "Хинди",
      "Spanish": "Испанский",
      "Telugu": "Телугу",
      "Tamil": "Тамильский",
      "Marathi": "Маратхи",
      "Punjabi": "Панджаби",
      "Russian": "Русский",
      "French": "Французский",
      "Play All": "Играть все",
      "Search songs": "Искать песни",
      "Search tracks": "Искать треки",
      "Payment mode": "Способ оплаты"
    },
    fr: {
      "Home": "Accueil",
      "Playlist": "Playlist",
      "Artist": "Artiste",
      "Downloads": "Telechargements",
      "Your Library": "Votre bibliotheque",
      "Upload Songs": "Televerser des chansons",
      "Buy Membership": "Acheter un abonnement",
      "Settings": "Parametres",
      "Profile": "Profil",
      "Switch Account": "Changer de compte",
      "Language": "Langue",
      "English": "Anglais",
      "Hindi": "Hindi",
      "Spanish": "Espagnol",
      "Telugu": "Telougou",
      "Tamil": "Tamoul",
      "Marathi": "Marathi",
      "Punjabi": "Pendjabi",
      "Russian": "Russe",
      "French": "Francais",
      "Play All": "Tout lire",
      "Search songs": "Rechercher des chansons",
      "Search tracks": "Rechercher des titres",
      "Search and filter": "Rechercher et filtrer",
      "Payment mode": "Mode de paiement"
    }
  };

  Object.keys(COMMON_TRANSLATIONS).forEach((lang) => {
    EXACT[lang] = { ...(EXACT[lang] || {}), ...COMMON_TRANSLATIONS[lang] };
  });

  function normalizeLanguage(input) {
    const value = String(input || "").trim().toLowerCase();
    if (SUPPORTED[value]) return value;
    if (value === "english") return "en";
    if (value === "hindi") return "hi";
    if (value === "spanish") return "es";
    if (value === "telugu") return "te";
    if (value === "tamil") return "ta";
    if (value === "marathi") return "mr";
    if (value === "punjabi") return "pa";
    if (value === "russian") return "ru";
    if (value === "french") return "fr";
    return "en";
  }

  function getLanguage() {
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY) || "en");
  }

  let currentLanguage = getLanguage();
  let observerStarted = false;
  let internalUpdate = false;
  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();

  function getLocale() {
    return SUPPORTED[currentLanguage]?.locale || "en-US";
  }

  function interpolate(template, vars = {}) {
    return String(template || "").replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  }

  function getGreeting(hours) {
    const slot = hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";
    const greetings = {
      en: { morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening" },
      hi: { morning: "सुप्रभात", afternoon: "शुभ दोपहर", evening: "शुभ संध्या" },
      es: { morning: "Buenos dias", afternoon: "Buenas tardes", evening: "Buenas noches" },
      te: { morning: "శుభోదయం", afternoon: "శుభ మధ్యాహ్నం", evening: "శుభ సాయంత్రం" },
      ta: { morning: "காலை வணக்கம்", afternoon: "மதிய வணக்கம்", evening: "மாலை வணக்கம்" },
      mr: { morning: "शुभ प्रभात", afternoon: "शुभ दुपार", evening: "शुभ संध्या" },
      pa: { morning: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", afternoon: "ਸ਼ੁੱਭ ਦੁਪਹਿਰ", evening: "ਸ਼ੁੱਭ ਸ਼ਾਮ" },
      ru: { morning: "Доброе утро", afternoon: "Добрый день", evening: "Добрый вечер" },
      fr: { morning: "Bonjour", afternoon: "Bon apres-midi", evening: "Bonsoir" }
    };
    return greetings[currentLanguage]?.[slot] || greetings.en[slot];
  }

  function t(key, vars = {}) {
    const template = KEYED[currentLanguage]?.[key] || KEYED.en[key] || "";
    return interpolate(template, vars);
  }

  function translateExact(text) {
    return EXACT[currentLanguage]?.[text] || text;
  }

  function translatePattern(text) {
    const greetingMatch = text.match(/^(Good Morning|Good Afternoon|Good Evening),\s*(.+)$/);
    if (greetingMatch) return `${getGreeting(greetingMatch[1] === "Good Morning" ? 9 : greetingMatch[1] === "Good Afternoon" ? 15 : 20)}, ${greetingMatch[2]}`;

    const homeMatch = text.match(/^Curated sounds for (.+) while the backend is handled in Java\/MySQL\.$/);
    if (homeMatch) return t("home.todayLabel", { weekday: homeMatch[1] });

    return text;
  }

  function translateText(text) {
    if (currentLanguage === "en") return text;
    const trimmed = String(text || "");
    const leading = trimmed.match(/^\s*/)?.[0] || "";
    const trailing = trimmed.match(/\s*$/)?.[0] || "";
    const core = trimmed.trim();
    if (!core) return text;
    const translated = translatePattern(translateExact(core));
    return `${leading}${translated}${trailing}`;
  }

  function translateAttribute(element, attr) {
    const current = element.getAttribute(attr);
    if (!current) return;
    let originalMap = attributeOriginals.get(element);
    if (!originalMap) {
      originalMap = new Map();
      attributeOriginals.set(element, originalMap);
    }
    if (!originalMap.has(attr)) originalMap.set(attr, current);
    const original = originalMap.get(attr) || current;
    const nextValue = currentLanguage === "en" ? original : translateText(original);
    if (current !== nextValue) element.setAttribute(attr, nextValue);
  }

  function processTextNode(node) {
    const raw = node.textContent;
    if (!raw || !raw.trim()) return;
    if (!textOriginals.has(node)) textOriginals.set(node, raw);
    const original = textOriginals.get(node) || raw;
    const nextValue = currentLanguage === "en" ? original : translateText(original);
    if (node.textContent !== nextValue) node.textContent = nextValue;
  }

  function applyTranslations(root = document.body) {
    if (!root) return;
    internalUpdate = true;

    document.documentElement.lang = SUPPORTED[currentLanguage]?.lang || "en";

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    while (walker.nextNode()) processTextNode(walker.currentNode);

    root.querySelectorAll("*").forEach((element) => {
      ["placeholder", "title", "aria-label"].forEach((attr) => {
        if (element.hasAttribute(attr)) translateAttribute(element, attr);
      });
    });
    internalUpdate = false;
  }

  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const observer = new MutationObserver((mutations) => {
      if (internalUpdate) return;
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
          if (!textOriginals.has(mutation.target)) textOriginals.set(mutation.target, mutation.target.textContent);
          processTextNode(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE) applyTranslations(node);
        });
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
    });
  }

  function setLanguage(language) {
    currentLanguage = normalizeLanguage(language);
    try {
      window.localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (error) {
      // Ignore storage failures in preview mode.
    }
    applyTranslations(document.body);
    window.dispatchEvent(new CustomEvent("tunewave-language-changed", { detail: { language: currentLanguage } }));
    return currentLanguage;
  }

  window.TuneWaveLanguage = {
    getLanguage: () => currentLanguage,
    setLanguage,
    getLocale,
    getGreeting,
    translateText,
    translateChoice: translateExact,
    t,
    applyTranslations
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(document.body);
    startObserver();
  });
})();
