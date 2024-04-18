import toast from 'react-hot-toast';


const notify = (message, type) => {
  console.log('notify:', message, type);
  const background = '#004d4d';
  const color = 'white';
  const border = '2px solid #4d0099';

  if (type == 'success') {
    toast.success(message, {
      style: {
          borderRadius: '8px',
          background: background,
          color: color,
          border: border,
      }
    });
  };

  if (type == 'error') {
    toast.error(message, {
      style: {
          borderRadius: '8px',
          background: background,
          color: color,
          border: border,
      }
    });
  }

  if (type == 'info') {
    toast(message, {
      style: {
          borderRadius: '8px',
          background: background,
          color: color,
          border: border,
      }
    });
  };

}


export { notify };
