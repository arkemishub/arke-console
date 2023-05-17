/**
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./crud/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@arkejs/{ui,table}/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@arkejs/ui/plugin")],
  arkeUI: {
    theme: {
      colors: {
        background: {
          200: "#1D1F29",
          300: "#18191E",
          400: "#111218",
          DEFAULT: "#0B0C11",
        },
        neutral: {
          400: "#797D92",
          DEFAULT: "#25262C",
        },
        primary: { DEFAULT: "#78E7B0", 800: "#1B2B28" },
      },
    },
  },
};
