import { sveltekit } from '@sveltejs/kit/vite';
import { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['project']
		}
	}
};

export default config;
