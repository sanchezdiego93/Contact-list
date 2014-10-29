package practica.contactos.dominios


import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ContactoController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
            params.max = Math.min(max ?: 10, 100)
        respond Contacto.list(params), model: [contactoInstanceCount: Contacto.count()]
    }

    def show(Contacto contactoInstance) {
        respond contactoInstance
    }

    def create() {
        respond new Contacto(params)
    }

    @Transactional
    def save(Contacto contactoInstance) {
        if (contactoInstance == null) {
            notFound()
            return
        }

        if (contactoInstance.hasErrors()) {
            respond contactoInstance.errors, view: 'create'
            return
        }
        def dep
        for(departamento_el in params.departamento_elementos) {
            def value = departamento_el.getValue()
            if (value instanceof String) {
                println(value)
                dep = Departamento.findByNombre(value)

                if(dep){
                    contactoInstance.addToDepartamentos(dep)
                }
            } else {
                for(oneValue in value) {
                    println(oneValue)
                    dep = Departamento.findByNombre(oneValue)

                    if(dep){
                        contactoInstance.addToDepartamentos(dep)
                    }
                }
            }
        }
        contactoInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'contacto.label', default: 'Contacto'), contactoInstance.id])
                redirect contactoInstance
            }
            '*' { respond contactoInstance, [status: CREATED] }
        }
    }

    def edit(Contacto contactoInstance) {
        respond contactoInstance
    }

    @Transactional
    def update(Contacto contactoInstance) {
        if (contactoInstance == null) {
            notFound()
            return
        }

        if (contactoInstance.hasErrors()) {
            respond contactoInstance.errors, view: 'edit'
            return
        }
        contactoInstance.departamentos.clear()
        def dep
        for(departamento_el in params.departamento_elementos) {
            def value = departamento_el.getValue()
            if (value instanceof String) {
                println(value)
                dep = Departamento.findByNombre(value)

                if(dep){
                    contactoInstance.addToDepartamentos(dep)
                }
            } else {
                for(oneValue in value) {
                    println(oneValue)
                    dep = Departamento.findByNombre(oneValue)

                    if(dep){
                        contactoInstance.addToDepartamentos(dep)
                    }
                }
            }
        }
        contactoInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Contacto.label', default: 'Contacto'), contactoInstance.id])
                redirect contactoInstance
            }
            '*' { respond contactoInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Contacto contactoInstance) {

        if (contactoInstance == null) {
            notFound()
            return
        }

        contactoInstance.delete flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Contacto.label', default: 'Contacto'), contactoInstance.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'contacto.label', default: 'Contacto'), params.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }
}
