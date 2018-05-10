import React from 'react';
// import PropTypes from 'prop-types';

import CollaboratorList from './CollaboratorList';
import New from '../common/New';
import { addCollaborator } from '../../actions/collaborators';

const Share = () => (
  <div>
    <New view="share" onAdd={addCollaborator} />
    <CollaboratorList view="share" />
  </div>
);

export default Share;
