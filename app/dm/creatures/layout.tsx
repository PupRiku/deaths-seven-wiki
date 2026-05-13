export default function CreaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: '.wiki-sidebar{display:none!important}.wiki-main{margin-left:0!important}',
        }}
      />
      {children}
    </>
  )
}
