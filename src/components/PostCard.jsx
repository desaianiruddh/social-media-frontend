import React from 'react';
import { Button, Icon, Label, Card, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

const PostCard = ({
  post: { body, createdAt, id, userName, likeCount, commentCount, likes },
}) => {
  const user = useSelector((state) => state.userData.user);
  return (
    <Card fluid>
      <Card.Content>
        <Popup
          content={userName}
          inverted
          trigger={
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          }
        />
        <Card.Header as={Link} to={`/posts/${id}`}>
          {userName}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true) + ' ago'}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.userName === userName && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
