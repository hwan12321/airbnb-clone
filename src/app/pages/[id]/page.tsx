type TProps = {
  params: {
    id: number
  };
}

export default function Create({params} : TProps) {
    return (
      <>Read{params.id}</>
    );
}