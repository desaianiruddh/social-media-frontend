import React, { useState } from 'react';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../util/graphql';

const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost, { error }] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update(proxy, result) {
      setConfirmOpen(false);
      if (callback) callback();
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter((post) => post.id !== postId),
        },
      });
    },
  });
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { postId, commentId },
  });
  if (error) {
    error.graphQLErrors[0] && alert(error.graphQLErrors[0].message);
  }
  return (
    <>
      <Popup
        content={commentId ? 'Delete Comment' : 'Delete Post'}
        inverted
        trigger={
          <Button
            as="div"
            labelPosition="right"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Button color="red" style={{ margin: 0 }} basic>
              <Icon name="trash" />
            </Button>
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={commentId ? deleteComment : deletePost}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        userName
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
