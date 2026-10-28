"""Punto de entrada local: procesa un video de principio a fin."""
import argparse


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    args = parser.parse_args()
    raise NotImplementedError(f"pipeline para {args.video}")


if __name__ == "__main__":
    main()
