"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Isole les erreurs de chargement/rendu WebGL (GLB corrompu, contexte perdu,
 * etc.) pour qu'elles ne fassent jamais planter la page entière. Le Hero
 * bascule sur `fallback` (poster statique) ; le reste du site reste navigable.
 */
export class HeroErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("[Hero] scène 3D indisponible, fallback affiché :", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
