import Image from "next/image";

const pages: {
  [key: string]: string
} = {
  "/": "авторизация",
  "/404": "404",
  "/forum": "форум",
  "/blog": "блог",
  "/profile": "это вы",
};

const resolvePage = (page: string) => {
  return pages[page] ?? page.slice(0);
}

const Header = ({ page }: {page: string}) => {
  return (
    <header>
      <Image src={"/logotype.png"} alt="lafka logo" width={139} height={38} />
      <span className="spectral">
        {resolvePage(page)}
      </span>
      <input placeholder="Поиск..." type="text" />
    </header>
  )
};

export default Header;
