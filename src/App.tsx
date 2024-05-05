import { Route, Routes } from "react-router-dom";
import ProSideBar from "./pages/ProSideBar";
import Documentation from "./pages/Documentation";
import Users from "./pages/users/Users";
import Header from "./components/Header";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddUser from "./pages/users/AddUser";
import UpdateUser from "./pages/users/UpdateUser";
import Account from "./pages/Account";
import Authors from "./pages/authors/Authors";
import AddAuthor from "./pages/authors/AddAuthor";
import Error403 from "./pages/Error403";
import UpdateAuthor from "./pages/authors/UpdateAuthor";
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import UpdateCategory from "./pages/categories/UpdateCategory";
import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import UpdateProduct from "./pages/products/UpdateProduct";

const App: React.FC = () => {
  return (
    <div className="min-h-screen relative flex">
      <ProSideBar />
      <div className="w-full  bg-slate-200">
        <Header></Header>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/" Component={Documentation} />
          <Route path="/403" Component={Error403} />
          <Route element={<ProtectedRoute role="Admin" />}>
            <Route path="/users" Component={Users} />
          </Route>
          <Route element={<ProtectedRoute role={undefined} />}>
            <Route path="/user" Component={AddUser} />
            <Route path="/user/:userId" Component={UpdateUser} />

            <Route path="/account" Component={Account} />

            <Route path="/authors" Component={Authors} />
            <Route path="/author" Component={AddAuthor} />
            <Route path="/author/:authorId" Component={UpdateAuthor} />

            <Route path="/categories" Component={Categories} />
            <Route path="/category" Component={AddCategory} />
            <Route path="/category/:cateId" Component={UpdateCategory} />

            <Route path="/products" Component={Products} />
            <Route path="/product" Component={AddProduct} />
            <Route path="/product/:productId" Component={UpdateProduct} />
          </Route>
        </Routes>
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
