 #!/bin/bash

# Automated setup for Angular 17+ 
# Tailwind + ESLint + Prettier + Husky + SEO service


echo "Starting Angular Pro Setup..."

# 1. Ask for project name
read -p "Project name: " web

# 2. Create Angular project
ng new $PROJECT_NAME --routing --style=css --strict
cd $PROJECT_NAME

# 3. Install TailwindCSS + plugins
echo "Installing TailwindCSS..."
npm install -D tailwindcss@3.4.1 postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init

# 4. Configure Tailwind content scanning
sed -i '' 's/content: \[\]/content: \[".\/src\/\*\*\/\*.{html,ts}"\]/' tailwind.config.js

# 5. Add Tailwind directives to styles.css
echo "@tailwind base;" >> src/styles.css
echo "@tailwind components;" >> src/styles.css
echo "@tailwind utilities;" >> src/styles.css

# 6. Install Angular ESLint + Prettier
echo "Installing ESLint & Prettier..."
ng add @angular-eslint/schematics
npm install -D prettier eslint-config-prettier

# 7. Create or overwrite eslint.config.js
cat <<EOL > eslint.config.js
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": ["error", { "type": "attribute", "prefix": "app", "style": "camelCase" }],
      "@angular-eslint/component-selector": ["error", { "type": "element", "prefix": "app", "style": "kebab-case" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true, "allowTypedFunctionExpressions": true }],
      "no-console": ["warn", { "allow": ["warn", "error"] }]
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
EOL

# 8. Add scripts to package.json
echo "Adding scripts to package.json..."
npx json -I -f package.json -e '
this.scripts.lint="ng lint",
this.scripts.format="prettier --write \"src/**/*.{ts,html,css}\"",
this.scripts.postinstall="npm run lint && npm run format"
'

# 9. Install Husky + Lint-staged
echo "Setting up Husky + Lint-Staged..."
npx husky-init && npm install
npm install -D lint-staged

# Create lint-staged.config.js
cat <<EOL > lint-staged.config.js
module.exports = {
  "src/**/*.{ts,html,css}": ["npm run lint", "npm run format"],
};
EOL

# 10. Create SEO Service
echo "Creating SEO Service..."
ng g service services/seo

# 11. Overwrite SEO Service with boilerplate
cat <<EOL > src/app/services/seo.service.ts
import { Injectable } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateTitle(title: string) {
    this.title.setTitle(title)
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description })
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords })
  }

  setSEOData(seoData: { title?: string; description?: string; keywords?: string }) {
    if (seoData.title) {
      this.updateTitle(seoData.title)
    }
    if (seoData.description) {
      this.updateDescription(seoData.description)
    }
    if (seoData.keywords) {
      this.updateKeywords(seoData.keywords)
    }
  }
}
EOL

# Done!
echo "Angular Pro Setup Complete! Project ready at: $PROJECT_NAME"
y