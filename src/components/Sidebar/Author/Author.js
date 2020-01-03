// @flow strict
import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';

type Props = {
  author: {
    name: string,
    bio: string,
    photo: string
  },
  isIndex: ?boolean
};

const Author = ({ author, isIndex }: Props) => (
  <div className={styles['author']}>
    <Link to="/">
      <img
        src={withPrefix(author.photo)}
        className={styles['author__photo']}
        width="200"
        height="200"
        alt={author.name}
      />
    </Link>
    <div>
    <a href="/" className={styles['logo']}>
      <img src="https://res.cloudinary.com/hlsr7ls49/image/upload/c_pad,h_314,q_80,w_600/v1572840398/mdpq2bdet7nuhw9stixq.png"></img>
    </a>
    </div>
    {/* { isIndex === true ? (
      <h1 className={styles['author__title']}>
        <Link className={styles['author__title-link']} to="/">{author.name}</Link>
      </h1>
    ) : (
      <h2 className={styles['author__title']}>
        <Link className={styles['author__title-link']} to="/">{author.name}</Link>
      </h2>
    )} */}
    {/* <p className={styles['author__subtitle']}>{author.bio}</p> */}
  </div>
);

export default Author;
