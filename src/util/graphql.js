import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      userName
      createdAt
      comments {
        id
        userName
        body
        createdAt
      }
      likes {
        id
        userName
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;
