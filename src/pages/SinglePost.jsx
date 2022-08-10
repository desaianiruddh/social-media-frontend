import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Form,
  Grid,
  Image,
  Icon,
  Label,
} from 'semantic-ui-react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const user = useSelector((state) => state.userData.user);
  const { postId } = useParams();
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update(_, result) {
      console.log(result);
      setComment('');
    },
  });
  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{data.getPost.userName}</Card.Header>
                <Card.Meta>
                  {moment(data.getPost.createdAt).fromNow(true) + ' ago'}
                </Card.Meta>
                <Card.Description>{data.getPost.body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  post={{
                    id: data.getPost.id,
                    likes: data.getPost.likes,
                    likeCount: data.getPost.likeCount,
                  }}
                />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {data.getPost.commentCount}
                  </Label>
                </Button>
                {user && user.userName === data.getPost.userName && (
                  <DeleteButton
                    postId={data.getPost.id}
                    callback={() => navigate('/')}
                  />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input field">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        type="submit"
                        name="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={createComment}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {data.getPost.comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user &&
                    (user.userName === comment.userName ||
                      user.userName === data.getPost.userName) && (
                      <DeleteButton
                        postId={data.getPost.id}
                        commentId={comment.id}
                      />
                    )}
                  <Card.Header>{comment.userName}</Card.Header>
                  <Card.Meta>
                    {moment(comment.createdAt).fromNow(true) + ' ago'}
                  </Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

const CREATE_COMMENT_MUTATION = gql`
  mutation Mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        userName
        body
        createdAt
      }
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
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
export default SinglePost;
