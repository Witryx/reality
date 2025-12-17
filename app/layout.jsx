export const metadata = {
  title: 'Egyptsko Česká Reality',
  description: 'Nemovitosti v Egyptě',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
