import React from 'react';
// import PropTypes from 'prop-types';

import ShareList from './ShareList';
import New from '../common/New';
import { addCollaborator } from '../../actions/collaborators';

const Share = () => (
  <div>
    <New view="share" onAdd={addCollaborator} />
    <ShareList view="share" />
  </div>
);

export default Share;
