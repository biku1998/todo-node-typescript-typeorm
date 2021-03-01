const getFormattedError = (errors: string[]) => {
  return {
    errors: {
      body: errors,
    },
  };
};

export { getFormattedError };
