import dagger
from dagger import dag, function, object_type

DEFAULT_NODE_IMAGE = "node:22.14-bookworm"


@object_type
class App:

    def init_frontend(self, app_dir: dagger.Directory) -> dagger.Container:
        """Initializes the frontend"""
        return (
            dag.container()
            .from_(DEFAULT_NODE_IMAGE)
            .with_directory("/app", app_dir)
            .with_workdir("/app")
            .with_exec(["npm", "install"])
        )
    
    @function
    def test_frontend_ng(self, app_dir: dagger.Directory, node_image: str = DEFAULT_NODE_IMAGE) -> dagger.Container:
        """Tests the frontend"""
        return (
            self.init_frontend(app_dir)
            .with_env_variable("CACHE_BUSTER","1")
            .with_exec(["npm", "run", "test"])
        )
    
    @function
    def build_frontend_ng(self, app_dir: dagger.Directory, node_image: str = DEFAULT_NODE_IMAGE) -> dagger.Container:
        """Builds the frontend"""
        return self.test_frontend_ng(app_dir, node_image).with_exec(["npm", "run", "build"])

    @function
    def build_frontend_image(self, app_dir: dagger.Directory, node_image: str = DEFAULT_NODE_IMAGE) -> dagger.Container:
        """Builds the frontend image"""
        app_build = self.build_frontend_ng(app_dir, node_image)
        return (
            dag.container()
            .from_("nginx:1.25.3-bookworm")
            .with_exposed_port(description="HTTP", port=80)
            .with_directory("/usr/share/nginx/html", app_build.directory("/app/dist/frontend/browser"))
        )