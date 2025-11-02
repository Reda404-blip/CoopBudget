export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      <p>
        © {currentYear} CoopBudget - Développé par <span className="font-semibold">Reda El Maaroufi</span> (Étudiant)
        sous l'encadrement du <span className="font-semibold">Prof. Abdelghni Essahli</span>
      </p>
    </footer>
  )
}
