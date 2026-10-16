# Rental Management Website

A responsive rental-management starter built with HTML, CSS, JavaScript modules, Firebase Authentication (email/password), and Cloud Firestore. It includes properties, tenants, and rent payment records.

## Important privacy note

GitHub Pages hosts the website files publicly. That is okay for the front-end code, but **do not put real tenant or rent information in HTML/JavaScript files or GitHub**. Data is stored in Firestore. Firebase web configuration is not a service-account secret, but Firestore Security Rules are essential. Never commit service-account JSON, private keys, passwords, or API tokens.

This starter is designed for a single-owner account. It does not yet include editing records, automated rent-due calculations, exports, backups, or payment processing. Test with fake data first.

## 1. Create a Firebase web app

1. Open https://console.firebase.google.com/ and choose your existing project.
2. Project settings (gear) → General → Your apps → add a Web app (`</>`).
3. Register it and copy the Firebase web config.
4. Replace the placeholders in `firebase-config.js`.
5. Authentication → Sign-in method → enable **Email/Password**.
6. Authentication → Settings → Authorized domains: add your GitHub Pages domain (for example `yourname.github.io`) and later your custom domain.
7. Firestore Database → create a database if one does not already exist.
8. Open Firestore Rules and publish the contents of `firestore.rules`.

Do not use open rules such as `allow read, write: if true`. The rules in this project restrict each document to the signed-in account whose UID is stored in `ownerUid`.

## 2. Important first-account setup

The website has a Create account button. For a private site, do not leave public account creation available forever.

Recommended setup:
1. Deploy the site.
2. Create your owner account using the website.
3. In Firebase Console → Authentication → Users, copy the owner's UID.
4. After you have confirmed you can sign in, disable public self-registration by removing/hiding the Create account button and its handler in `index.html` / `app.js`, or add an administrator-controlled account process. This is important because the front-end's register button otherwise allows anyone to create an account. Firestore rules still prevent one user from reading another user's documents, but the login page itself is public.
5. Keep your Firebase project owner account secured with a strong unique password and multi-factor authentication on the Google account.

## 3. Run locally

Because the app uses JavaScript modules, serve it through a local web server rather than opening `index.html` directly. One option is the VS Code Live Server extension. Open the project folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.

## 4. Publish on GitHub Pages (free)

1. Create/sign in to GitHub at https://github.com/.
2. Create a new repository, e.g. `rental-management-website`.
3. Upload all files in this folder to the repository root (not the ZIP file).
4. On GitHub, open repository **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. The site URL will look like `https://YOUR-USERNAME.github.io/rental-management-website/`.
7. In Firebase Authentication → Settings → Authorized domains, add `YOUR-USERNAME.github.io`.

## 5. Custom domain (optional later)

GitHub Pages supports custom domains. In repository Settings → Pages, enter the domain and follow GitHub's exact DNS instructions at your domain registrar. DNS changes can take time. You generally pay the registrar for the domain name even though GitHub Pages hosting is free. Enable HTTPS in Pages settings when available.

Docs:
- GitHub Pages: https://docs.github.com/pages
- Firebase web setup: https://firebase.google.com/docs/web/setup
- Firebase Authentication: https://firebase.google.com/docs/auth/web/password-auth
- Firestore rules: https://firebase.google.com/docs/firestore/security/get-started

## Troubleshooting

- `auth/unauthorized-domain`: add the current site domain under Firebase Authentication → Settings → Authorized domains.
- `Missing or insufficient permissions`: publish the supplied rules and check the signed-in account.
- `Firebase: Error (auth/email-already-in-use)`: sign in instead of creating the account again.
- If the Firebase config still contains placeholders, the app will show a setup reminder.
