import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.subTitle}>About</h2>
        <h1 className={styles.title}>Evangadi Network Q&amp;A</h1>
        <p className={styles.text}>
          No matter what stage of life you are in, whether you’re just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p className={styles.text}>
          Whether you are willing to share knowledge or you are just looking to
          meet mentors of your own, please start by joining the network here.
        </p>
        <Link to="/how-it-works">
          <button className={styles.button}>HOW IT WORKS</button>
        </Link>
      </div>
    </section>
  );
};

export default About;
