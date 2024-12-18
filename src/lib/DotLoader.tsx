import styles from './DotLoader.module.scss';

export interface DotLoaderProps { }

const DotLoader = ({ }: DotLoaderProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
};
export default DotLoader;