// ============================================================
// Auth.jsx
// ============================================================
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Auth() {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [isLoginMode, setIsLoginMode]     = useState(true);
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError]                 = useState("");      // ← NEW: shows API errors
  const [loading, setLoading]             = useState(false);   // ← NEW: disables button while waiting
  const fileInputRef = useRef(null);

  // ← NEW: lets us navigate to home after successful login
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // ----------------------------------------------------------
  // FUNCTIONS
  // ----------------------------------------------------------

  function toggleMode() {
    setIsLoginMode(!isLoginMode);
    setProfilePreview(null);
    setError("");   // ← NEW: clear any errors when switching modes
  }

  function handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  // ── UPDATED: handleAuth now calls the real API ─────────────
  // Was: alert("Sign in functionality requires backend integration.")
  // Now: calls login() or register() from utils/api.js,
  //      saves the token to localStorage on success,
  //      shows the API error message if something goes wrong.
  async function handleAuth(e) {
    e.preventDefault();
    setError("");       // clear previous errors
    setLoading(true);   // disable button and show "Please wait..."

    try {
      if (isLoginMode) {
        // ── SIGN IN ──────────────────────────────────────────
        // Reads email + password directly from the form fields
        await login(
          e.target.email.value,
          e.target.password.value
        );
      } else {
        // ── SIGN UP ──────────────────────────────────────────
        // Reads email, password, and displayName from the form.
        // Falls back to the email if displayName is empty.
        await register(
          e.target.email.value,
          e.target.password.value,
          e.target.displayName?.value || e.target.email.value
        );
      }

      // Success — navigate to home page
      navigate("/");

    } catch (err) {
      // Show the error message from the API
      // e.g. "Invalid email or password" or "Email already exists"
      setError(err.message);
    } finally {
      setLoading(false); // re-enable the button whether it worked or not
    }
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main center-content">
      <div className="auth-card">

        {/* TITLE */}
        <h1 className="auth-title">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h1>

        {/* SUBTITLE */}
        <p className="text-muted">
          {isLoginMode
            ? "Sign in to manage your listings"
            : "Join the marketplace and start selling"}
        </p>

        <form onSubmit={handleAuth} style={{ marginTop: "2rem" }}>

          {/* SIGNUP-ONLY FIELDS */}
          {!isLoginMode && (
            <div>

              {/* Profile picture upload */}
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Profile Picture
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>

                  {/* Preview circle */}
                  <div style={{
                    width: "6rem", height: "6rem",
                    border: "2px solid var(--border)", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--card)", fontSize: "2rem",
                    color: "var(--muted-foreground)", overflow: "hidden"
                  }}>
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <img src="/icons/user.svg" alt="Profile" style={{ width: "2.4rem", height: "2.4rem", opacity: 0.65 }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Upload area */}
                    <div
                      className="upload-area"
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        margin: 0, padding: "1rem", textAlign: "center",
                        border: "2px dashed var(--border)",
                        borderRadius: "var(--radius)", cursor: "pointer",
                        background: "var(--card)"
                      }}
                    >
                      <span className="upload-text" style={{ fontSize: "0.875rem" }}>
                        Click to upload profile picture
                      </span>
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProfilePictureUpload}
                    />
                    <p className="text-xs text-muted" style={{ marginTop: "0.5rem" }}>
                      JPG, PNG. Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Signup-only text fields */}
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" name="displayName" placeholder="Your profile name" />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Your first name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Your last name" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="(555) 123-4567" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="address" placeholder="123 Main St" />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" placeholder="Los Angeles" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" placeholder="California" />
                </div>
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zip" placeholder="90001" />
              </div>
            </div>
          )}

          {/* Email + Password — shown in both modes */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required minLength={6} placeholder="••••••••" />
          </div>

          {/* ── NEW: Error message from API ──────────────────────
              Shows when login fails e.g. wrong password,
              or when register fails e.g. email already taken.
              Hidden when error is empty string. */}
          {error && (
            <p style={{
              color: "var(--destructive)",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              padding: "0.6rem 0.75rem",
              background: "var(--muted)",
              borderRadius: "var(--radius)",
              border: "0.5px solid var(--destructive)",
            }}>
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON
              ── UPDATED: disabled while loading, text changes to
              "Please wait..." so the user knows it's working. */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? "Please wait..."
              : isLoginMode ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <hr className="separator" />

        {/* TOGGLE LINK */}
        <p className="auth-toggle">
          <span style={{ marginRight: "25px" }}>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            className="link-primary"
            onClick={toggleMode}
            style={{ fontSize: "0.65625rem" }}
          >
            {isLoginMode ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </main>
  );
}

export default Auth;
