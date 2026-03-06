import styles from "./dropdown.module.css";

export const Dropdown = ({
  children,
  summary,
  id,
  className
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
  id: string;
  className?: string;
}) => {
  return (
    <div className={`${styles.dropdown} ${className}`}>
      <div
        className={styles.summary}
        onClick={(event) => {
          const element = event.currentTarget.ownerDocument.getElementById(
            id
          ) as HTMLElement;

          element.style.display === "flex"
            ? (element.style.display = "none")
            : (element.style.display = "flex");

          event.preventDefault();
        }}
      >
        {summary}
      </div>
      <div id={id} className={styles.content}>
        {children}
      </div>
    </div>
  );
};
