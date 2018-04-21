import React from 'react';
// import PropTypes from 'prop-types';

import ShareList from './ShareList';
import New from './New';
import { addCollaborator } from '../actions/collaborators';

const Share = () => (
  <div>
    <New view="share" onAdd={addCollaborator} />
    <ShareList />
  </div>
);

export default Share;
