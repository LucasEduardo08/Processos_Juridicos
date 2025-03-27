import styles from './HeaderPage.module.css';
const HeaderPage = ({children}) => {
  return (
    <header className={styles.header}>
      {children}
    </header>
  );
}

export default HeaderPage;