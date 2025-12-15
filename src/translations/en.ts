import { TranslationKeys } from './pt';

export const en: TranslationKeys = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    loading: 'Loading...',
    noResults: 'No results found',
    clear: 'Clear',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    yes: 'Yes',
    no: 'No',
  },

  // Navbar
  navbar: {
    searchPlaceholder: 'Search resource...',
    reports: 'Reports',
    charts: 'Charts',
    admin: 'Admin',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign Out',
  },

  // Dashboard
  dashboard: {
    welcome: 'Hello',
    subtitle: 'Manage your availability and see who is in the office.',
    administrator: 'Administrator',
    resource: 'Resource',
    weekly: 'Weekly',
    monthly: 'Monthly',
    officeToday: 'In Office Today',
    homeOffice: 'Home Office',
    corporateTravel: 'Corporate Travel',
    dayOff: 'Day Off',
    vacation: 'Vacation',
    noOneInOffice: 'No one in the office today.',
    validated: 'Validated',
    pending: 'Pending',
    noCheckin: 'No check-in',
  },

  // Status
  status: {
    office: 'Office',
    home_office: 'Home Office',
    corporate_travel: 'Corporate Travel',
    day_off: 'Day Off',
    vacation: 'Vacation',
  },

  // Weekly View
  weekly: {
    title: 'Weekly View',
    previousWeek: 'Previous week',
    nextWeek: 'Next week',
    currentWeek: 'Current week',
    resource: 'Resource',
  },

  // Monthly View
  monthly: {
    title: 'Monthly View',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    currentMonth: 'Current month',
  },

  // Office Time Dialog
  officeTime: {
    title: 'Office Hours',
    arrivalTime: 'Arrival Time',
    departureTime: 'Departure Time',
    save: 'Save',
  },

  // Check-in
  checkin: {
    checkIn: 'Check in',
    cancelCheckin: 'Cancel check-in',
    validate: 'Validate presence',
    pendingValidation: 'Awaiting validation',
    validatedBy: 'Validated by',
  },

  // Auth
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    country: 'Country',
    selectCountry: 'Select country',
    forgotPassword: 'Forgot password',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send reset link',
    backToLogin: 'Back to login',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    countries: {
      argentina: 'Argentina',
      brasil: 'Brazil',
      chile: 'Chile',
      colombia: 'Colombia',
      eua: 'USA',
    },
    passwordRequirements: {
      title: 'Password strength',
      minLength: '8 characters minimum',
      lowercase: 'Lowercase letter',
      uppercase: 'Uppercase letter',
      number: 'Number',
    },
    passwordStrength: {
      weak: 'Weak',
      medium: 'Medium',
      good: 'Good',
      strong: 'Strong',
      secure: 'Secure password! All requirements met.',
    },
    errors: {
      invalidEmail: 'Invalid email',
      passwordMismatch: 'Passwords do not match',
      weakPassword: 'Password does not meet requirements',
    },
  },

  // Profile
  profile: {
    title: 'My Profile',
    fullName: 'Full Name',
    email: 'Email',
    jobFunction: 'Job Function',
    resourceGroup: 'Group',
    groupAdminOnly: 'Group can only be changed by an administrator',
    updateSuccess: 'Profile updated successfully',
    updateError: 'Error updating profile',
  },

  // Admin
  admin: {
    title: 'Administration',
    users: 'Users',
    createUser: 'Create User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    deleteConfirm: 'Are you sure you want to delete this user?',
    role: 'Role',
    active: 'Active',
    inactive: 'Inactive',
  },

  // Settings
  settings: {
    title: 'Settings',
    userRoles: 'User Roles',
    changeRole: 'Change role',
  },

  // Reports
  reports: {
    title: 'Reports',
    selectMonth: 'Select month',
    export: 'Export',
    totalDays: 'Total days',
    officeDays: 'Office days',
    homeOfficeDays: 'Home office days',
    travelDays: 'Travel days',
    dayOffDays: 'Days off',
    vacationDays: 'Vacation days',
  },

  // Charts
  charts: {
    title: 'Charts',
    selectMonth: 'Select month',
    statusDistribution: 'Status Distribution',
    weeklyTrend: 'Weekly Trend',
  },

  // Resource Groups
  resourceGroup: {
    head: 'Head',
    lead: 'Lead',
    equipe: 'Team',
  },

  // Days of week
  days: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  },

  // Months
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
};
