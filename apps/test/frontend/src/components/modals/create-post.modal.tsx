import { MouseEvent, useEffect, useState } from "react";

import styles from "./create-post.module.css";

import { POST_TAGS } from "@lafka/types";
import type { Post } from "@lafka/types";
import { Dropdown } from "../dropdown";

// ПОКА ЧТО ЭТО НИ НА ЧТО НЕ ВЛИЯЕТ
// НО БЭКЕНДЕР ОЧЕНЬ СИЛЬНО ХОЧЕТ ЧТО-ТО ВНЕДРИТЬ
//                                        — Ваш бэкендер
export const CreatePost = ({ type }: { type: "blog"|"forum" }) => {
  const [ actived, setActived ] = useState<boolean>(false);
  const [ tags, setTags ] = useState<((typeof POST_TAGS)[number])[]>([...POST_TAGS]);
  const [ choosedTags, setChoosedTags ] = useState<((typeof POST_TAGS)[number])[]>([]);

  if (!actived) {
    return (
      <>
        <button onClick={() => setActived(true)}>Создать пост</button>
      </>
    )
  }

  const send = (data: FormData) => {
    console.log(data)
  };

  return (
    <>
      <button>Создать пост</button>
      <div
        onClick={(event) => {
          if ((event.target as HTMLElement).className !== styles.modal_background) return;

          (event.target as HTMLElement).animate([
            { opacity: "1" },
            { opacity: "0" }
          ], {
            duration: 300,
            fill: "forwards"
          }).addEventListener("finish", () => {
            setActived(false)
          })
        }}
        className={styles.modal_background}
      >
        <div className={styles.modal}>
          <h2>Создайте свой пост!</h2>
          <form className={styles.form} id="create-post" action={(data) => send(data)} method="post">
            <div className={styles.content}>
              <span>Название:</span>
              <input id="create-post" required placeholder="Название" type="text" />
            </div>
            <div className={styles.content}>
              <span>Контент:</span>
              <textarea id="create-post" required placeholder="Контент"></textarea>
            </div>
            <div className={styles.content}>
              <span>Описание:</span>
              <textarea id="create-post" placeholder="Описание"></textarea>
            </div>
            <div className={styles.content}>
              <input
                id="create-post"
                type="submit"
                value="send"
                style={{alignSelf: "flex-end"}}
              />
            </div>

            <Dropdown id="choose-tag" summary={<span className="noselect">Выберите тег</span>}>
              {
                tags.map(tag => 
                  <div
                    className={`${styles.tag} noselect`}
                    onClick={() => {
                      const array = [...tags];
                      const choosedTagsArray = [...choosedTags];

                      const element = array.splice(tags.indexOf(tag), 1);
                      choosedTagsArray.push(...element)
                      
                      setChoosedTags(choosedTagsArray);
                      setTags(array);
                    }}
                  >{tag}</div>
                )
              }
            </Dropdown>

            <div className={styles.choosed_tags}>
              <span>Выбранные теги:</span>
              <div>
                {
                  choosedTags.map(tag => 
                    <div
                      className={`${styles.choosed_tag} noselect`}
                      onClick={() => {
                        const array = [...tags];
                        const choosedTagsArray = [...choosedTags];

                        const element = choosedTagsArray.splice(choosedTags.indexOf(tag), 1);
                        array.push(...element);
                        
                        setChoosedTags(choosedTagsArray);
                        setTags(array);
                      }}
                    >× {tag}</div>
                  )
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};