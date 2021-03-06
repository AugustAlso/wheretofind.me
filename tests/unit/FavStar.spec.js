import { shallowMount } from '@vue/test-utils';
import FavStar from '@/components/FavStar.vue';
import MockUrls from '../mockUrls';

jest.mock('axios');
window.Urls = MockUrls;

describe('FavStar.vue', () => {
  let context;

  beforeEach(() => {
    const $http = {
      post: jest.fn(),
      delete: jest.fn(),
    };
    const mocks = {
      $http,
    };
    const propsData = {
      username: 'test',
      small: false,
    };
    context = {
      $http,
      mocks,
      propsData,
    };
  });

  test('toggleFavstar restores inactive if follow fails', () => {
    const { propsData, mocks } = context;
    propsData.active = false;
    const wrapper = shallowMount(FavStar, { propsData, mocks });
    wrapper.vm.follow = jest.fn().mockReturnValue(Promise.reject());

    wrapper.vm.toggleFavstar();
    expect(wrapper.vm.follow).toHaveBeenCalled();
    expect(wrapper.vm.active).toBe(false);
  });

  test('toggleFavstar restores active if unfollow fails', () => {
    const { propsData, mocks } = context;
    propsData.active = true;
    const wrapper = shallowMount(FavStar, { propsData, mocks });
    wrapper.vm.unfollow = jest.fn().mockReturnValue(Promise.reject());

    wrapper.vm.toggleFavstar();
    expect(wrapper.vm.unfollow).toHaveBeenCalled();
    expect(wrapper.vm.active).toBe(true);
  });

  test('unfollow', () => {
    const { propsData, mocks } = context;
    propsData.active = true;
    const wrapper = shallowMount(FavStar, { propsData, mocks });

    wrapper.vm.unfollow();
    expect(wrapper.vm.$http.delete).toHaveBeenCalledWith('/api/follows/test/');
  });

  test('follow', () => {
    const { propsData, mocks } = context;
    propsData.active = false;
    const wrapper = shallowMount(FavStar, { propsData, mocks });

    wrapper.vm.follow();
    expect(wrapper.vm.$http.post).toHaveBeenCalledWith('/api/follows/', {
      to_user: 'test',
    });
  });
});
