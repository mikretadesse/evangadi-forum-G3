import React from "react";
import classes from "./Footer.module.css";
import logo from "../../assets/images/evangadi-logo-footer.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className={`${classes.footer} d-lg-flex`}>
      {/* LEFT */}
      <div className={`${classes.footer__left} mx-sm-5`}>
        <div className={classes.footer__logo}>
          <img src={logo} alt="Evangadi Logo" />
        </div>

        <div className={`${classes.footer__socialMedias} col-sm-12`}>
          <div className={`${classes.footer__facebook} mx-2`}>
            <a
              href="https://www.facebook.com/Evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>

          <div className={`${classes.footer__instagram} mx-3`}>
            <a
              href="https://www.instagram.com/evangaditech/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>

          <div className={classes.footer__youtube}>
            <a
              href="https://www.youtube.com/c/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div className={`${classes.footer__middle} mx-sm-5`}>
        <div className={classes.footer__info}>Useful Links</div>
        <div className={classes.footer__infoText}>
          <Link to="/how-it-works" className={classes.footerLink}>
            How it works
          </Link>
          <div className="mb-2">
            <Link to="/terms" className={classes.footerLink}>
              Terms of Service
            </Link>
          </div>
          <Link to="/terms" className={classes.footerLink}>
            Privacy Policy
          </Link>
         </div>
      </div>

      {/* RIGHT */}
      <div className={`${classes.footer__right} mx-sm-5`}>
        <div className={classes.footer__info}>Contact Info</div>
        <div className={classes.footer__infoText}>
          <div className="mb-2">Evangadi Network</div>
          <div className="mb-2">support@evangadi.com</div>
          <div className="mb-2">+1-202-386-2702</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
