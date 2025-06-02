import React from 'react';
import { useParams } from 'react-router-dom';
import Photo from '../components/Photo';

function IdolPhoto() {
  const { name } = useParams();

  return <Photo name={name} />;
}

export default IdolPhoto;