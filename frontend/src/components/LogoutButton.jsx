export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
    >
      Đăng xuất
    </button>
  );
}
