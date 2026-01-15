import React from "react";
import "./Terms.css";

const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      <header className="terms-header">
        <h1>Terms and Conditions</h1>
        <p className="last-update">Last Updated: January 11, 2026</p>
      </header>

      <main className="terms-content">
        <section className="intro">
          <h2>Welcome to EvangadiForum</h2>
          <p>
            EvangadiForum is a community-driven Q&A platform for Full Stack
            Development learners and professionals. By using our platform, you
            agree to these terms.
          </p>
        </section>

        <section className="terms-section">
          <h3>1. Our Purpose</h3>
          <p>
            We provide a space for developers to ask questions, share knowledge,
            and collaborate on Full Stack Development topics including frontend,
            backend, databases, and DevOps.
          </p>
        </section>

        <section className="terms-section">
          <h3>2. Account Rules</h3>
          <ul>
            <li>Use your real name and accurate information</li>
            <li>Keep your password secure</li>
            <li>You must be at least 13 years old</li>
            <li>One account per person</li>
          </ul>
        </section>

        <section className="terms-section">
          <h3>3. Community Guidelines</h3>
          <div className="guidelines-box">
            <div className="do-box">
              <h4>✅ Do:</h4>
              <ul>
                <li>Ask clear, specific questions</li>
                <li>Share code with explanations</li>
                <li>Be respectful to everyone</li>
                <li>Give credit for borrowed code</li>
              </ul>
            </div>
            <div className="dont-box">
              <h4>❌ Don't:</h4>
              <ul>
                <li>Post hateful or harassing content</li>
                <li>Share complete project solutions</li>
                <li>Advertise products or services</li>
                <li>Post assignments expecting others to complete them</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <h3>4. Content Ownership</h3>
          <p>
            You own what you post. By posting, you allow us to show your content
            to other users. You also allow others to learn from and use your
            code snippets (with proper attribution).
          </p>
        </section>

        <section className="terms-section">
          <h3>5. Privacy</h3>
          <p>
            We respect your privacy. We collect only necessary information to
            provide our services and improve your experience. We never sell your
            personal data.
          </p>
        </section>

        <section className="terms-section">
          <h3>6. Our Responsibilities</h3>
          <p>
            We will maintain a safe, respectful environment and remove
            inappropriate content. However, we cannot guarantee all answers are
            correct or that the site will always be available.
          </p>
        </section>

        <section className="terms-section">
          <h3>7. Your Responsibilities</h3>
          <p>
            Use the platform for learning and teaching. Help others when you
            can. Report problems you see. Remember that other users are here to
            learn, just like you.
          </p>
        </section>

        <section className="terms-section">
          <h3>8. Contact Us</h3>
          <div className="contact-box">
            <p>
              <strong>Email:</strong> support@evangadiforum.com
            </p>
            <p>
              <strong>For technical issues:</strong> tech@evangadiforum.com
            </p>
            <p>
              <strong>Report abuse:</strong> report@evangadiforum.com
            </p>
          </div>
        </section>

        <div className="agreement-box">
          <p className="agreement-text">
            By using EvangadiForum, you agree to help create a positive learning
            environment for all developers.
          </p>
          <button className="back-button" onClick={() => window.history.back()}>
            Back to Forum
          </button>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
