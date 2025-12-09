export const metadata = {
  title: 'Egypt Real Estate',
  description: 'Prémiové nemovitosti v Egyptě – CZ / EN / DE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
