import styles from "./Container.module.css";

const ContainerComponent = ({children}) => {
    return (
      <div className={styles.container}>
        {children}
      </div>
    )
}

export default ContainerComponent;