import { Users } from '../../models/Users';

const user = new Users();

describe('User Model', () => {
  it('should have an index method', () => {
    expect(user.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(user.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(user.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(user.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(user.delete).toBeDefined();
  });
  let id: number;
  it('create method should add a user', async () => {
    const result = await user.create({
      username: 'MutasimSweileh',
      password: 'test1234',
      firstname: 'Mutasim',
      lastname: 'Sweileh'
    });
    expect(result.username).toEqual('MutasimSweileh');
    id = result.id as number;
  });

  it('index method should return a list of users', async () => {
    const result = await user.index();
    expect(result).toContain({
      id,
      username: 'MutasimSweileh',
      firstname: 'Mutasim',
      lastname: 'Sweileh'
    });
  });

  it('show method should return the correct user', async () => {
    const result = await user.show(`${id}`);
    expect(result.username).toEqual('MutasimSweileh');
  });
  it('update method should edit a user', async () => {
    const result = await user.update(id, {
      username: 'MutasimSweileh2',
      password: 'test12345',
      firstname: 'Mutasim',
      lastname: 'Sweileh'
    });
    expect(result).toEqual({
      id,
      username: 'MutasimSweileh2',
      firstname: 'Mutasim',
      lastname: 'Sweileh'
    });
  });
  it('delete method should remove the user', async () => {
    const result = await user.delete(`${id}`);
    expect(result.id).toEqual(id);
  });
});
