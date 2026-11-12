# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# Using HTTP API using Axios
## Basic Usage
[Reference](https://www.geeksforgeeks.org/reactjs/axios-in-react-a-guide-for-beginners/)
### Get Method
```typescript
import axios from 'axios';
const App = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios
            .get("https://jsonplaceholder.typicode.com/posts")
            .then((response) => setData(response.data))
            .catch((err) => console.error(err));
    }, []);
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
export default App;
```

### Post
```typescript
import axios from 'axios';

const CreatePost = () => {
    const [response, setResponse] = useState(null);
    const handlePost = () => {
        const newPost = { title: "Test Title", body: "Test Body" };

        axios
            .post("https://jsonplaceholder.typicode.com/posts", newPost)
            .then((res) => setResponse(res.data))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <button onClick={handlePost}>Send POST Request</button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
};

export default CreatePost;
```

## Advanced Usages with common Lib
### Get Method
```typescript
import { http, setAuthToken, ApiError } from "@/lib/http";

setAuthToken(token);
const users = await http.get<User[]>("/users");
await http.post("/users", { name: "Ada" });

try {
  await http.delete(`/users/${id}`);
} catch (err) {
  if (err instanceof ApiError && err.status === 404) { /* ... */ }
}
```
### POST
#### Raw JSON
```typescript
import { http } from "@/lib/http";

interface CreateUserPayload { name: string; email: string; roles: string[]; }
interface User { id: string; name: string; email: string; roles: string[]; }

const user = await http.post<User, CreateUserPayload>("/users", {
  name: "Ada",
  email: "ada@example.com",
  roles: ["admin"],
});
```
#### FORMDATA - Multipart
```typescript
const form = new FormData();
form.append("userId", "42");
form.append("avatar", file);          // File from <input type="file">
form.append("caption", "Profile photo");

const result = await http.post<{ id: string; url: string }, FormData>("/users/avatar", form);
```

