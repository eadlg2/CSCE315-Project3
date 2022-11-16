import SideNav from '../../../components/side-nav/SideNav'

function ManageSideNav() {
  let manageCategories = ['Sales', 'Inventory', 'Menu']

  return <SideNav items={manageCategories} />
}

export default ManageSideNav
