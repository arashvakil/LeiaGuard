export type Language = 'en' | 'fa';

export interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    confirm: string;
    yes: string;
    no: string;
    backToDashboard: string;
    deviceNotFound: string;
    deviceNotFoundDescription: string;
    loadingConfiguration: string;
    confirmDelete: string;
  };
  
  // Navigation
  nav: {
    dashboard: string;
    devices: string;
    myDevices: string;
    allDevices: string;
    addDevice: string;
    account: string;
    admin: string;
    logout: string;
    login: string;
    signup: string;
    support: string;
  };

  // Profile Settings
  profile: {
    title: string;
    personalInfo: string;
    personalInfoDescription: string;
    accountSettings: string;
    accountSettingsDescription: string;
    security: string;
    securityDescription: string;
    changePassword: string;
    changePasswordDescription: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePassword: string;
    passwordUpdated: string;
    passwordUpdateFailed: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    languageSettings: string;
    languageSettingsDescription: string;
    selectLanguage: string;
    english: string;
    persian: string;
    languageUpdated: string;
    appearance: string;
    appearanceDescription: string;
    theme: string;
    selectTheme: string;
    system: string;
    light: string;
    dark: string;
  };
  
  // Authentication
  auth: {
    username: string;
    password: string;
    confirmPassword: string;
    invitationCode: string;
    loginTitle: string;
    signupTitle: string;
    loginButton: string;
    signupButton: string;
    loginLink: string;
    signupLink: string;
    loginSuccess: string;
    loginError: string;
    signupSuccess: string;
    signupError: string;
    invalidCredentials: string;
    userExists: string;
      invalidInviteCode: string;
  inviteCodeExpired: string;
  inviteCodeMaxUsed: string;
  inviteCodeDisabled: string;
    loginDescriptionText: string;
    signupDescriptionText: string;
    signingInText: string;
    creatingAccountText: string;
    createAccountWithCode: string;
    signInToAccount: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    addDevice: string;
    noDevices: string;
    noDevicesSubtitle: string;
    addFirstDevice: string;
    deviceName: string;
    ipAddress: string;
    status: string;
    created: string;
    actions: string;
    active: string;
    inactive: string;
    downloadConfig: string;
    viewQR: string;
    deleteDevice: string;
    quickSetupGuide: string;
    quickSetupSubtitle: string;
    mobileSetup: string;
    desktopSetup: string;
    yourVPNDevices: string;
    yourVPNDevicesDescription: string;
    downloadConfigSuccess: string;
    deleteDeviceSuccess: string;
    failedToLoadDevices: string;
    failedToDeleteDevice: string;
  };

  // New Device
  newDevice: {
    title: string;
    description: string;
    deviceNameLabel: string;
    deviceNamePlaceholder: string;
    addDeviceButton: string;
    deviceNameRequired: string;
    deviceAddedSuccess: string;
    addDeviceFailed: string;
    unknownError: string;
  };
  
  // Device Configuration
  deviceConfig: {
    title: string;
    setupInstructions: string;
    scanQR: string;
    scanQRDescription: string;
    downloadConfig: string;
    downloadConfigDescription: string;
    deviceName: string;
    ipAddress: string;
    status: string;
    downloadConfFile: string;
    mobileSetupTitle: string;
    mobileSetupDescription: string;
    desktopSetupTitle: string;
    desktopSetupDescription: string;
    step1Download: string;
    step2Setup: string;
    downloadOnAppStore: string;
    getOnGooglePlay: string;
    downloadFromWireguard: string;
    securityNoticeTitle: string;
    securityNoticeDescription: string;
    loadingQRCode: string;
    failedToLoadConfig: string;
    mobileSteps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
    };
    desktopSteps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
  };

  // Support
  support: {
    title: string;
    subtitle: string;
    emailSupportTitle: string;
    emailSupportDescription: string;
    contactUsAt: string;
  };
  
  // Admin
  admin: {
    title: string;
    userManagement: string;
    userManagementDescription: string;
    totalUsers: string;
    activeUsers: string;
    username: string;
    role: string;
    status: string;
    devices: string;
    invitationCode: string;
    joined: string;
    lastLogin: string;
    actions: string;
    admin: string;
    user: string;
    active: string;
    disabled: string;
    makeAdmin: string;
    removeAdmin: string;
    activate: string;
    deactivate: string;
    never: string;
    confirmMakeAdmin: string;
    confirmRemoveAdmin: string;
    confirmActivate: string;
    confirmDeactivate: string;
    userActivated: string;
    userDeactivated: string;
    userMadeAdmin: string;
    userRemovedAdmin: string;
    updateError: string;
  };
  
  // Marketing
  marketing: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    getStarted: string;
    learnMore: string;
    features: string;
    pricing: string;
    about: string;
    contact: string;
    faq: string;
    secureAccess: string;
    secureAccessDescription: string;
    invitationOnly: string;
    invitationOnlyDescription: string;
    multiDevice: string;
    multiDeviceDescription: string;
    registerWithCode: string;
    needInvitationCode: string;
    privateVPNService: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      backToDashboard: "Back to Dashboard",
      deviceNotFound: "Device Not Found",
      deviceNotFoundDescription: "The device you are trying to access does not exist or has been deleted.",
      loadingConfiguration: "Loading Configuration",
      confirmDelete: "Are you sure you want to delete this device?",
    },
    
    nav: {
      dashboard: "Dashboard",
      devices: "Devices",
      myDevices: "My Devices",
      allDevices: "All Devices",
      addDevice: "Add Device",
      account: "Account",
      admin: "Admin",
      logout: "Logout",
      login: "Login",
      signup: "Sign Up",
      support: "Support",
    },

    profile: {
      title: "Profile Settings",
      personalInfo: "Personal Information",
      personalInfoDescription: "Manage your personal details and preferences",
      accountSettings: "Account Settings",
      accountSettingsDescription: "Configure your account preferences",
      security: "Security",
      securityDescription: "Manage your account security settings",
      changePassword: "Change Password",
      changePasswordDescription: "Update your account password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      updatePassword: "Update Password",
      passwordUpdated: "Password updated successfully",
      passwordUpdateFailed: "Failed to update password",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 8 characters",
      passwordsDoNotMatch: "Passwords do not match",
      languageSettings: "Language Settings",
      languageSettingsDescription: "Choose your preferred language",
      selectLanguage: "Select Language",
      english: "English",
      persian: "Persian (فارسی)",
      languageUpdated: "Language updated successfully",
      appearance: "Appearance",
      appearanceDescription: "Customize how the interface looks and feels",
      theme: "Theme",
      selectTheme: "Select theme",
      system: "System",
      light: "Light",
      dark: "Dark",
    },
    
    auth: {
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      invitationCode: "Invitation Code",
      loginTitle: "Welcome Back",
      signupTitle: "Create Account",
      loginButton: "Sign In",
      signupButton: "Create Account",
      loginLink: "Already have an account? Sign in",
      signupLink: "Don't have an account? Sign up",
      loginDescriptionText: "Access your secret digital hideout",
      signupDescriptionText: "Join our exclusive club of internet ninjas",
      signingInText: "Signing in...",
      creatingAccountText: "Creating account...",
      createAccountWithCode: "Create Account with Secret Code",
      signInToAccount: "Sign In to Your Account",
      loginSuccess: "Logged in successfully",
      loginError: "Login failed",
      signupSuccess: "Account created successfully",
      signupError: "Account creation failed",
      invalidCredentials: "Invalid username or password",
      userExists: "Username already exists",
        invalidInviteCode: "Invalid invitation code",
  inviteCodeExpired: "Invitation code has expired",
  inviteCodeMaxUsed: "Invitation code has reached maximum uses",
  inviteCodeDisabled: "Invitation code is disabled",
    },
    
    dashboard: {
      title: "Dashboard",
      subtitle: "Manage your WireGuard VPN devices and configurations.",
      addDevice: "Add Device",
      noDevices: "No devices configured yet",
      noDevicesSubtitle: "Add your first device to get started with the VPN",
      addFirstDevice: "Add Your First Device",
      deviceName: "Device Name",
      ipAddress: "IP Address",
      status: "Status",
      created: "Created",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      downloadConfig: "Download Config",
      viewQR: "View QR Code & Setup",
      deleteDevice: "Delete Device",
      quickSetupGuide: "Quick Setup Guide",
      quickSetupSubtitle: "How to connect your devices to the VPN",
      mobileSetup: "Mobile Setup (iOS/Android)",
      desktopSetup: "Desktop Setup (Windows/Mac/Linux)",
      yourVPNDevices: "Your VPN Devices",
      yourVPNDevicesDescription: "Manage your VPN devices and configurations.",
      downloadConfigSuccess: "Configuration downloaded successfully",
      deleteDeviceSuccess: "Device deleted successfully",
      failedToLoadDevices: "Failed to load devices",
      failedToDeleteDevice: "Failed to delete device",
    },

    newDevice: {
      title: "Add New Device",
      description: "Enter a name for your new WireGuard device.",
      deviceNameLabel: "Device Name",
      deviceNamePlaceholder: "e.g., My Laptop, Work Phone",
      addDeviceButton: "Add Device",
      deviceNameRequired: "Device name is required",
      deviceAddedSuccess: "Device added successfully!",
      addDeviceFailed: "Failed to add device",
      unknownError: "An unknown error occurred",
    },
    
    deviceConfig: {
      title: "Device Configuration",
      setupInstructions: "Setup instructions for",
      scanQR: "Scan QR Code",
      scanQRDescription: "Use the WireGuard mobile app to scan this QR code and automatically configure your device.",
      downloadConfig: "Download Configuration",
      downloadConfigDescription: "Download the configuration file for desktop WireGuard clients.",
      deviceName: "Device Name",
      ipAddress: "IP Address",
      status: "Status",
      downloadConfFile: "Download .conf File",
      mobileSetupTitle: "Mobile Setup (iOS/Android)",
      mobileSetupDescription: "Two easy ways to connect: scan the QR code for instant setup, or save the config file to import later",
      desktopSetupTitle: "Desktop Setup (Windows/Mac/Linux)",
      desktopSetupDescription: "Download WireGuard for your desktop and import the configuration",
      step1Download: "Step 1: Download the WireGuard app",
      step2Setup: "Step 2: Connect to your VPN",
      downloadOnAppStore: "Download on the App Store",
      getOnGooglePlay: "Get it on Google Play",
      downloadFromWireguard: "Download from wireguard.com",
      securityNoticeTitle: "Keep Your Configuration Secure",
      securityNoticeDescription: "Anyone with access to your configuration file or QR code can connect to your VPN network. Keep this information private and don't share it with untrusted parties.",
      loadingQRCode: "Loading QR Code",
      failedToLoadConfig: "Failed to load configuration",
      mobileSteps: {
        step1: "Download the official WireGuard app from the App Store or Google Play",
        step2: "Choose one of these setup methods:",
        step3: "Method 1 - QR Code (Fastest): Open WireGuard app → Tap \"+\" → \"Create from QR code\" → Scan the QR code above",
        step4: "Method 2 - Config File: Download the .conf file → Share/Save to WireGuard app → Import the configuration",
        step5: "Give your tunnel a descriptive name (like \"Home VPN\" or \"Work VPN\") and save it",
        step6: "Toggle the connection switch to ON to connect to your VPN",
      },
      desktopSteps: {
        step1: "Install and open the WireGuard application",
        step2: "Click \"Add Tunnel\" and select \"Add from file\"",
        step3: "Select the downloaded .conf file",
        step4: "Click \"Activate\" to connect",
      },
    },

    support: {
      title: "Support",
      subtitle: "Get help with your account and learning experience",
      emailSupportTitle: "Email Support",
      emailSupportDescription: "Have questions or need assistance? Our support team is here to help!",
      contactUsAt: "Contact us at:",
    },
    
    admin: {
      title: "Admin",
      userManagement: "User Management",
      userManagementDescription: "Manage user accounts and access permissions",
      totalUsers: "Total Users",
      activeUsers: "Active",
      username: "Username",
      role: "Role",
      status: "Status",
      devices: "Devices",
      invitationCode: "Invitation Code",
      joined: "Joined",
      lastLogin: "Last Login",
      actions: "Actions",
      admin: "Admin",
      user: "User",
      active: "Active",
      disabled: "Disabled",
      makeAdmin: "Make Admin",
      removeAdmin: "Remove Admin",
      activate: "Activate",
      deactivate: "Deactivate",
      never: "Never",
      confirmMakeAdmin: "Are you sure you want to make this user an admin?",
      confirmRemoveAdmin: "Are you sure you want to remove admin privileges from this user?",
      confirmActivate: "Are you sure you want to activate this user?",
      confirmDeactivate: "Are you sure you want to deactivate this user?",
      userActivated: "User activated successfully",
      userDeactivated: "User deactivated successfully",
      userMadeAdmin: "User promoted to admin successfully",
      userRemovedAdmin: "Admin privileges removed successfully",
      updateError: "Failed to update user",
    },
    
    marketing: {
      heroTitle: "Secret Portal",
      heroSubtitle: "Ultra-Secure Digital Tunneling",
      heroDescription: "Mysterious internet access for the chosen few. Browse like a digital ninja.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: "Features",
      pricing: "Pricing",
      about: "About",
      contact: "Contact",
      faq: "FAQ",
      secureAccess: "Secret Access",
      secureAccessDescription: "Military-grade encryption with mysterious protocols",
      invitationOnly: "Invitation Only",
      invitationOnlyDescription: "Exclusive access for the enlightened few",
      multiDevice: "Multi-Device",
      multiDeviceDescription: "Connect all your gadgets with magical configurations",
      registerWithCode: "Register with Secret Code",
      needInvitationCode: "Need a secret code? Contact the wizard.",
      privateVPNService: "Private tunneling service • Authorized wizards only",
    },
  },
  
  fa: {
    common: {
      loading: "در حال بارگذاری...",
      error: "خطا",
      success: "موفقیت",
      cancel: "لغو",
      save: "ذخیره",
      delete: "حذف",
      edit: "ویرایش",
      back: "بازگشت",
      next: "بعدی",
      previous: "قبلی",
      submit: "ارسال",
      confirm: "تأیید",
      yes: "بله",
      no: "خیر",
      backToDashboard: "بازگشت به داشبورد",
      deviceNotFound: "دستگاه یافت نشد",
      deviceNotFoundDescription: "دستگاهی که در حال دسترسی به آن هستید وجود ندارد یا حذف شده است.",
      loadingConfiguration: "در حال بارگذاری تنظیمات",
      confirmDelete: "آیا مطمئن هستید که می‌خواهید این دستگاه را حذف کنید؟",
    },
    
    nav: {
      dashboard: "داشبورد",
      devices: "دستگاه‌ها",
      myDevices: "دستگاه‌های من",
      allDevices: "همه دستگاه‌ها",
      addDevice: "افزودن دستگاه",
      account: "حساب کاربری",
      admin: "مدیریت",
      logout: "خروج",
      login: "ورود",
      signup: "ثبت‌نام",
      support: "پشتیبانی",
    },

    profile: {
      title: "تنظیمات پروفایل",
      personalInfo: "اطلاعات شخصی",
      personalInfoDescription: "مدیریت جزئیات شخصی و تنظیمات خود",
      accountSettings: "تنظیمات حساب",
      accountSettingsDescription: "تنظیمات حساب کاربری خود را پیکربندی کنید",
      security: "امنیت",
      securityDescription: "تنظیمات امنیتی حساب خود را مدیریت کنید",
      changePassword: "تغییر رمز عبور",
      changePasswordDescription: "رمز عبور حساب خود را به‌روزرسانی کنید",
      currentPassword: "رمز عبور فعلی",
      newPassword: "رمز عبور جدید",
      confirmNewPassword: "تأیید رمز عبور جدید",
      updatePassword: "به‌روزرسانی رمز عبور",
      passwordUpdated: "رمز عبور با موفقیت به‌روزرسانی شد",
      passwordUpdateFailed: "به‌روزرسانی رمز عبور ناموفق",
      passwordRequired: "رمز عبور الزامی است",
      passwordTooShort: "رمز عبور باید حداقل ۸ کاراکتر باشد",
      passwordsDoNotMatch: "رمزهای عبور مطابقت ندارند",
      languageSettings: "تنظیمات زبان",
      languageSettingsDescription: "زبان مورد نظر خود را انتخاب کنید",
      selectLanguage: "انتخاب زبان",
      english: "انگلیسی (English)",
      persian: "فارسی",
      languageUpdated: "زبان با موفقیت به‌روزرسانی شد",
      appearance: "ظاهر",
      appearanceDescription: "نحوه نمایش و احساس رابط کاربری را سفارشی کنید",
      theme: "تم",
      selectTheme: "انتخاب تم",
      system: "سیستم",
      light: "روشن",
      dark: "تاریک",
    },
    
    auth: {
      username: "نام کاربری",
      password: "رمز عبور",
      confirmPassword: "تأیید رمز عبور",
      invitationCode: "کد دعوت",
      loginTitle: "خوش آمدید",
      signupTitle: "ایجاد حساب کاربری",
      loginButton: "ورود",
      signupButton: "ایجاد حساب",
      loginLink: "حساب کاربری دارید؟ وارد شوید",
      signupLink: "حساب کاربری ندارید؟ ثبت‌نام کنید",
      loginDescriptionText: "به مخفیگاه دیجیتال خود دسترسی پیدا کنید",
      signupDescriptionText: "به باشگاه نینجاهای اینترنت بپیوندید",
      signingInText: "در حال ورود...",
      creatingAccountText: "در حال ایجاد حساب...",
      createAccountWithCode: "ایجاد حساب با کد مخفی",
      signInToAccount: "ورود به حساب کاربری",
      loginSuccess: "با موفقیت وارد شدید",
      loginError: "ورود ناموفق",
      signupSuccess: "حساب کاربری با موفقیت ایجاد شد",
      signupError: "ایجاد حساب کاربری ناموفق",
      invalidCredentials: "نام کاربری یا رمز عبور نادرست",
      userExists: "نام کاربری قبلاً وجود دارد",
        invalidInviteCode: "کد دعوت نامعتبر",
  inviteCodeExpired: "کد دعوت منقضی شده است",
  inviteCodeMaxUsed: "کد دعوت به حداکثر استفاده رسیده است",
  inviteCodeDisabled: "کد دعوت غیرفعال است",
    },
    
    dashboard: {
      title: "داشبورد",
      subtitle: "دستگاه‌ها و تنظیمات WireGuard VPN خود را مدیریت کنید.",
      addDevice: "افزودن دستگاه",
      noDevices: "هنوز هیچ دستگاهی تنظیم نشده",
      noDevicesSubtitle: "اولین دستگاه خود را اضافه کنید تا با VPN شروع کنید",
      addFirstDevice: "اولین دستگاه خود را اضافه کنید",
      deviceName: "نام دستگاه",
      ipAddress: "آدرس IP",
      status: "وضعیت",
      created: "ایجاد شده",
      actions: "عملیات",
      active: "فعال",
      inactive: "غیرفعال",
      downloadConfig: "دانلود تنظیمات",
      viewQR: "مشاهده QR کد و راه‌اندازی",
      deleteDevice: "حذف دستگاه",
      quickSetupGuide: "راهنمای سریع راه‌اندازی",
      quickSetupSubtitle: "نحوه اتصال دستگاه‌های خود به VPN",
      mobileSetup: "راه‌اندازی موبایل (iOS/Android)",
      desktopSetup: "راه‌اندازی دسکتاپ (Windows/Mac/Linux)",
      yourVPNDevices: "دستگاه‌های VPN شما",
      yourVPNDevicesDescription: "دستگاه‌های و VPN شما و تنظیمات را مدیریت کنید.",
      downloadConfigSuccess: "تنظیمات با موفقیت دانلود شد",
      deleteDeviceSuccess: "دستگاه با موفقیت حذف شد",
      failedToLoadDevices: "دستگاه‌های بارگذاری ناموفق",
      failedToDeleteDevice: "حذف دستگاه ناموفق",
    },

    newDevice: {
      title: "افزودن دستگاه جدید",
      description: "نامی برای دستگاه WireGuard جدید خود وارد کنید.",
      deviceNameLabel: "نام دستگاه",
      deviceNamePlaceholder: "مثال: لپ‌تاپ من، گوشی کاری",
      addDeviceButton: "افزودن دستگاه",
      deviceNameRequired: "نام دستگاه الزامی است",
      deviceAddedSuccess: "دستگاه با موفقیت اضافه شد!",
      addDeviceFailed: "افزودن دستگاه ناموفق",
      unknownError: "خطای نامشخص رخ داد",
    },
    
    deviceConfig: {
      title: "تنظیمات دستگاه",
      setupInstructions: "دستورالعمل راه‌اندازی برای",
      scanQR: "اسکن QR کد",
      scanQRDescription: "از اپلیکیشن WireGuard موبایل برای اسکن این QR کد و تنظیم خودکار دستگاه استفاده کنید.",
      downloadConfig: "دانلود تنظیمات",
      downloadConfigDescription: "فایل تنظیمات را برای کلاینت‌های دسکتاپ WireGuard دانلود کنید.",
      deviceName: "نام دستگاه",
      ipAddress: "آدرس IP",
      status: "وضعیت",
      downloadConfFile: "دانلود فایل .conf",
      mobileSetupTitle: "راه‌اندازی موبایل (iOS/Android)",
      mobileSetupDescription: "دو روش آسان برای اتصال: اسکن کد QR برای تنظیم فوری، یا ذخیره فایل تنظیم برای وارد کردن بعداً",
      desktopSetupTitle: "راه‌اندازی دسکتاپ (Windows/Mac/Linux)",
      desktopSetupDescription: "WireGuard را برای دسکتاپ خود دانلود کنید و تنظیمات را وارد کنید",
      step1Download: "مرحله ۱: دانلود اپلیکیشن WireGuard",
      step2Setup: "مرحله ۲: راه‌اندازی VPN شما",
      downloadOnAppStore: "دانلود از App Store",
      getOnGooglePlay: "دریافت از Google Play",
      downloadFromWireguard: "دانلود از wireguard.com",
      securityNoticeTitle: "تنظیمات خود را امن نگه دارید",
      securityNoticeDescription: "هر کسی که به فایل تنظیمات یا QR کد شما دسترسی داشته باشد می‌تواند به شبکه VPN شما متصل شود. این اطلاعات را خصوصی نگه دارید و با افراد غیرقابل اعتماد به اشتراک نگذارید.",
      loadingQRCode: "در حال بارگذاری QR کد",
      failedToLoadConfig: "دانلود تنظیمات ناموفق",
      mobileSteps: {
        step1: "دانلود اپلیکیشن رسمی WireGuard از App Store یا Google Play",
        step2: "یکی از این روش‌های تنظیم را انتخاب کنید:",
        step3: "روش ۱ - QR کد (سریعترین): باز کردن اپلیکیشن WireGuard → ضربه بزنید بر روی \"+\" → انتخاب \"از QR کد ایجاد کنید\" → اسکن کد QR بالا",
        step4: "روش ۲ - فایل تنظیم: دانلود فایل .conf → به اپلیکیشن WireGuard به اشتراک یا ذخیره کنید → وارد کردن تنظیمات",
        step5: "نام تونل خود را به صورت توصیفی (مثل \"VPN خانه\" یا \"VPN محل کار\") انتخاب کنید و ذخیره کنید",
        step6: "برای اتصال به VPN، سوئیچ اتصال را روشن کنید",
      },
      desktopSteps: {
        step1: "اپلیکیشن WireGuard را نصب و باز کنید",
        step2: "روی \"Add Tunnel\" کلیک کنید و \"Add from file\" را انتخاب کنید",
        step3: "فایل .conf دانلود شده را انتخاب کنید",
        step4: "برای اتصال روی \"Activate\" کلیک کنید",
      },
    },

    support: {
      title: "پشتیبانی",
      subtitle: "در مورد حساب کاربری و تجربه یادگیری خود کمک دریافت کنید",
      emailSupportTitle: "پشتیبانی ایمیل",
      emailSupportDescription: "سوال دارید یا به کمک نیاز دارید؟ تیم پشتیبانی ما اینجاست تا کمک کند!",
      contactUsAt: "با ما تماس بگیرید:",
    },
    
    admin: {
      title: "مدیریت",
      userManagement: "مدیریت کاربران",
      userManagementDescription: "مدیریت حساب‌های کاربری و مجوزهای دسترسی",
      totalUsers: "کل کاربران",
      activeUsers: "فعال",
      username: "نام کاربری",
      role: "نقش",
      status: "وضعیت",
      devices: "دستگاه‌ها",
      invitationCode: "کد دعوت",
      joined: "عضویت",
      lastLogin: "آخرین ورود",
      actions: "عملیات",
      admin: "مدیر",
      user: "کاربر",
      active: "فعال",
      disabled: "غیرفعال",
      makeAdmin: "مدیر کردن",
      removeAdmin: "حذف مدیریت",
      activate: "فعال‌سازی",
      deactivate: "غیرفعال‌سازی",
      never: "هرگز",
      confirmMakeAdmin: "آیا مطمئن هستید که می‌خواهید این کاربر را مدیر کنید؟",
      confirmRemoveAdmin: "آیا مطمئن هستید که می‌خواهید مجوزهای مدیریت این کاربر را حذف کنید؟",
      confirmActivate: "آیا مطمئن هستید که می‌خواهید این کاربر را فعال کنید؟",
      confirmDeactivate: "آیا مطمئن هستید که می‌خواهید این کاربر را غیرفعال کنید؟",
      userActivated: "کاربر با موفقیت فعال شد",
      userDeactivated: "کاربر با موفقیت غیرفعال شد",
      userMadeAdmin: "کاربر با موفقیت به مدیر ارتقا یافت",
      userRemovedAdmin: "مجوزهای مدیریت با موفقیت حذف شد",
      updateError: "به‌روزرسانی کاربر ناموفق",
    },
    
    marketing: {
      heroTitle: "پورتال مخفی",
      heroSubtitle: "تونل‌سازی دیجیتال فوق امن",
      heroDescription: "دسترسی مرموز اینترنت برای منتخبین. مثل نینجای دیجیتال جست‌وجو کنید.",
      getStarted: "شروع کنید",
      learnMore: "بیشتر بدانید",
      features: "ویژگی‌ها",
      pricing: "قیمت‌گذاری",
      about: "درباره ما",
      contact: "تماس",
      faq: "سوالات متداول",
      secureAccess: "دسترسی مخفی",
      secureAccessDescription: "رمزگذاری نظامی با پروتکل‌های مرموز",
      invitationOnly: "فقط با دعوت",
      invitationOnlyDescription: "دسترسی ویژه برای روشن‌فکران",
      multiDevice: "چند دستگاه",
      multiDeviceDescription: "همه گجت‌های خود را با تنظیمات جادویی متصل کنید",
      registerWithCode: "ثبت‌نام با کد مخفی",
      needInvitationCode: "کد مخفی نیاز دارید؟ با جادوگر تماس بگیرید.",
      privateVPNService: "سرویس تونل‌سازی خصوصی • فقط جادوگران مجاز",
    },
  },
};

// Translation hook
export function useTranslations(language: Language = 'en') {
  return translations[language];
}

// Helper function to get translated text
export function t(language: Language, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[language];
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
} 