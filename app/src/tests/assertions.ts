import { assert } from 'chai';

export const assertThrows = async ({
  method,
  assertions,
}: {
  method: () => Promise<any>;
  assertions?: (err: any) => void;
}): Promise<any> => {
  let error = null;
  try {
    await method();
  } catch (err) {
    console.log(err);

    error = err;
  }
  console.log(error, 'error');

  assert.isNotNull(error, 'Assert throws');
  // for typecheck
  if (!!error && assertions) {
    assertions(error);
  }
  return error;
};
