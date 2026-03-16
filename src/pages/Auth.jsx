// ============================================================
// Auth.jsx

// ============================================================

import { useState, useRef } from "react";

function Auth() {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------


  const [isLoginMode, setIsLoginMode] = useState(true);


  const [profilePreview, setProfilePreview] = useState(null);


  const fileInputRef = useRef(null);

  // ----------------------------------------------------------
  // FUNCTIONS
  // ----------------------------------------------------------


  function toggleMode() {
    setIsLoginMode(!isLoginMode);
    setProfilePreview(null); // reset preview when switching modes
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

  // Handle form submission

  function handleAuth(e) {
    e.preventDefault();
    alert(
      isLoginMode
        ? "Sign in functionality requires backend integration."
        : "Sign up functionality requires backend integration."
    );
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main center-content">
      <div className="auth-card">

        {/* TITLE
            */}
        <h1 className="auth-title">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h1>

        {/* SUBTITLE
            */}
        <p className="text-muted">
          {isLoginMode
            ? "Sign in to manage your listings"
            : "Join the marketplace and start selling"}
        </p>

        <form onSubmit={handleAuth} style={{ marginTop: "2rem" }}>

          {/* SIGNUP-ONLY FIELDS
              */}
          {!isLoginMode && (
            <div>

              {/* Profile picture upload */}
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Profile Picture
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>

                  {/* Preview circle
                       */}
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
                      "👤"
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Upload area
                         */}
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

                    {/* Hidden file input
                        */}
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

          {/*  */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required minLength={6} placeholder="••••••••" />
          </div>

          {/* SUBMIT BUTTON
               */}
          <button type="submit" className="btn btn-primary btn-full">
            {isLoginMode ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <hr className="separator" />

        {/* TOGGLE LINK
             */}
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
