import { useTranslations } from "next-intl"
import type { FormData } from "@/types/forms"

interface PersonalInfoStepProps {
  fullName: string
  fullNameError: string
  email: string
  emailError: string
  age: string
  ageError: string
  gender: string
  genderError: string
  phone: string
  phoneError: string
  onChange: (field: keyof FormData, value: string | string[]) => void
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  fullName,
  fullNameError,
  email,
  emailError,
  age,
  ageError,
  gender,
  genderError,
  phone,
  phoneError,
  onChange,
}) => {
  const t = useTranslations("UserForm")
  return (
    <>
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          Full Name *
        </label>
        <input
          type="text"
          value={fullName}
          onChange={e => onChange("fullName", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
          placeholder="John Doe"
        />
        {fullNameError && <p className="text-red-400 text-sm mt-1">{fullNameError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("form.age") || "Age"} *
          </label>
          <input
            type="number"
            value={age}
            onChange={e => onChange("age", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            placeholder="25"
          />
          {ageError && <p className="text-red-400 text-sm mt-1">{ageError}</p>}
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "oklch(0.9465 0.013 17.39)" }}
          >
            {t("form.gender") || "Gender"} *
          </label>
          <select
            value={gender}
            onChange={e => onChange("gender", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
          >
            <option value="" className="bg-gray-800">
              {t("form.select") || "Select"}
            </option>
            <option value="male" className="bg-gray-800">
              {t("form.male") || "Male"}
            </option>
            <option value="female" className="bg-gray-800">
              {t("form.female") || "Female"}
            </option>
          </select>
          {genderError && <p className="text-red-400 text-sm mt-1">{genderError}</p>}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.email") || "Email"} *
        </label>
        <input
          type="email"
          value={email}
          onChange={e => onChange("email", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
          placeholder={t("form.emailPlaceholder") || "john@example.com"}
        />
        {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "oklch(0.9465 0.013 17.39)" }}
        >
          {t("form.phoneNumber") || "Phone Number"} *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={e => onChange("phone", e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
          placeholder={t("form.phoneNumberPlaceholder") || "+1 (555) 123-4567"}
        />
        {phoneError && <p className="text-red-400 text-sm mt-1">{phoneError}</p>}
      </div>
    </>
  )
}

export default PersonalInfoStep
